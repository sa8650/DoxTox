/* ==========================================================================
   Cloudflare Pages Function: DoxTox website API + custom admin auth.
   Single catch-all router mounted at /api/dox/* (D1 database, no Supabase).

   Public:
     GET  content | products
     POST messages            {name,email,company,message}
     POST auth/login          {email,password}
     POST auth/setup          {setup_key,email,password}  (needs SETUP_SECRET)
     POST auth/logout
     GET  auth/me

   Admin (session cookie required):
     GET/PUT  admin/content
     GET/POST/PUT/DELETE admin/products
     GET/PUT/DELETE      admin/messages
     POST                admin/password
     GET                 admin/stats
   ========================================================================== */
const COOKIE = 'doxtox_session';
const SESSION_DAYS = 7;
const ITERATIONS = 210000;

const json = (data, status = 200, init = {}) =>
  new Response(JSON.stringify(data), { status, ...init, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...(init.headers || {}) } });
const ok = (data, init) => json({ ok: true, ...data }, 200, init);
const fail = (error, status = 400) => json({ ok: false, error }, status);

const hex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
const randHex = (bytes) => hex(crypto.getRandomValues(new Uint8Array(bytes)));
const cookies = (req) => Object.fromEntries((req.headers.get('cookie') || '').split(';').map((c) => {
  const i = c.indexOf('='); return i < 0 ? null : [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1).trim())];
}).filter(Boolean));
const ipOf = (req) => (req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, km, 256);
  return `pbkdf2$${ITERATIONS}$${hex(salt)}$${hex(bits)}`;
}
async function verifyPassword(password, stored) {
  const [scheme, iter, saltHex, hashHex] = String(stored || '').split('$');
  if (scheme !== 'pbkdf2' || !iter || !saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map((h) => parseInt(h, 16)));
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: parseInt(iter, 10), hash: 'SHA-256' }, km, 256);
  return hex(bits) === hashHex;
}
async function createSession(db, userId) {
  const token = randHex(32), exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  await db.prepare('INSERT INTO sessions (token, admin_user_id, expires_at) VALUES (?1,?2,?3)').bind(token, userId, exp).run();
  return token;
}
async function sessionUser(db, req) {
  const token = cookies(req)[COOKIE];
  if (!token) return null;
  return await db.prepare(
    `SELECT s.token, s.expires_at, u.id AS user_id, u.email
     FROM sessions s JOIN admin_users u ON u.id = s.admin_user_id
     WHERE s.token = ?1 AND s.expires_at > strftime('%s','now')`
  ).bind(token).first().catch(() => null);
}
async function destroySession(db, req) {
  const token = cookies(req)[COOKIE];
  if (token) await db.prepare('DELETE FROM sessions WHERE token = ?1').bind(token).run();
}
const setCookie = (token) =>
  ({ 'set-cookie': `${COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_DAYS * 86400}; SameSite=Lax; Secure` });
const clearCookie = () => ({ 'set-cookie': `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure` });

async function rateLimit(db, scope, key, limit, windowSec) {
  const now = Math.floor(Date.now() / 1000), bucket = now - (now % windowSec), id = `${scope}:${key}:${bucket}`;
  try {
    await db.prepare('INSERT INTO rate_limits (id, scope, hits, created_at) VALUES (?1,?2,1,?3) ON CONFLICT(id) DO UPDATE SET hits = hits + 1')
      .bind(id, scope, now).run();
    const row = await db.prepare('SELECT hits FROM rate_limits WHERE id = ?1').bind(id).first();
    return (row ? row.hits : 1) <= limit;
  } catch (e) { return true; } // fail open if table missing
}
const parseTags = (s) => { try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
const mapProduct = (p) => p && { ...p, tags: parseTags(p.tags), featured: !!p.featured, external: !!p.external, active: !!p.active };

export async function onRequest(context) {
  try {
    const { request, env } = context;
    const db = env.DB;
    if (!db) return fail('Database not configured.', 500);
    const method = request.method.toUpperCase();
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/dox\/?/, '').replace(/\/+$/, '');
    const body = async () => { try { return await request.json(); } catch (e) { return {}; } };
    const validEmail = (x) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(x || ''));

    /* ---------- public: content ---------- */
    if (path === 'content' && method === 'GET') {
      const row = await db.prepare('SELECT content FROM site_content WHERE id = 1').first().catch(() => null);
      let content = null;
      try { content = row ? JSON.parse(row.content) : null; } catch (e) { content = null; }
      return ok({ content });
    }

    /* ---------- public: products ---------- */
    if (path === 'products' && method === 'GET') {
      const { results } = await db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY sort_order ASC, title ASC').all();
      return ok({ products: (results || []).map(mapProduct) });
    }

    /* ---------- public: contact message ---------- */
    if (path === 'messages' && method === 'POST') {
      if (!(await rateLimit(db, 'contact', ipOf(request), 5, 600))) return fail('Too many submissions. Please try again later.', 429);
      const b = await body();
      if (b.website) return ok({ received: true }); // honeypot
      const name = String(b.name || '').trim().slice(0, 120);
      const email = String(b.email || '').trim().toLowerCase().slice(0, 160);
      const company = b.company ? String(b.company).trim().slice(0, 160) : null;
      const message = String(b.message || '').trim().slice(0, 5000);
      if (!name || !email || !message) return fail('Name, email and message are required.');
      if (!validEmail(email)) return fail('Please enter a valid email address.');
      await db.prepare('INSERT INTO contact_messages (id, name, email, company, message) VALUES (?1,?2,?3,?4,?5)')
        .bind(crypto.randomUUID(), name, email, company, message).run();
      return ok({ received: true });
    }

    /* ---------- auth: setup (create/reset admin via SETUP_SECRET) ---------- */
    if (path === 'auth/setup' && method === 'POST') {
      if (!env.SETUP_SECRET) return fail('Setup is disabled.', 404);
      if (!(await rateLimit(db, 'setup', ipOf(request), 10, 900))) return fail('Too many attempts. Please try again later.', 429);
      const b = await body();
      const given = String(b.setup_key || ''), expected = String(env.SETUP_SECRET);
      let mismatch = expected.length !== given.length;
      for (let i = 0; i < Math.min(expected.length, given.length); i++) if (expected.charCodeAt(i) !== given.charCodeAt(i)) mismatch = true;
      if (mismatch) return fail('Incorrect setup key.', 403);
      const email = String(b.email || '').trim().toLowerCase();
      const password = String(b.password || '');
      if (!validEmail(email)) return fail('Enter a valid email address.');
      if (password.length < 10) return fail('Password must be at least 10 characters.');
      await db.prepare('INSERT INTO admin_users (email, password_hash) VALUES (?1,?2) ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash')
        .bind(email, await hashPassword(password)).run();
      return ok({ ready: true });
    }

    /* ---------- auth: login ---------- */
    if (path === 'auth/login' && method === 'POST') {
      if (!(await rateLimit(db, 'login', ipOf(request), 8, 900))) return fail('Too many attempts. Please wait a few minutes.', 429);
      const b = await body();
      const email = String(b.email || '').trim().toLowerCase();
      const password = String(b.password || '');
      if (!email || !password) return fail('Email and password are required.');
      const user = await db.prepare('SELECT * FROM admin_users WHERE email = ?1').bind(email).first().catch(() => null);
      const valid = user ? await verifyPassword(password, user.password_hash) : false;
      if (!user || !valid) return fail('Incorrect email or password.', 401);
      const token = await createSession(db, user.id);
      return ok({ user: { email: user.email } }, { headers: setCookie(token) });
    }

    /* ---------- auth: logout ---------- */
    if (path === 'auth/logout' && method === 'POST') {
      await destroySession(db, request);
      return ok({}, { headers: clearCookie() });
    }

    /* ---------- auth: me ---------- */
    if (path === 'auth/me' && method === 'GET') {
      const u = await sessionUser(db, request);
      if (!u) return fail('Not signed in.', 401);
      return ok({ user: { email: u.email } });
    }

    /* ====================== ADMIN (session required) ====================== */
    const admin = await sessionUser(db, request);
    if (path.startsWith('admin')) {
      if (!admin) return fail('Authentication required. Please sign in again.', 401);

      /* stats */
      if (path === 'admin/stats' && method === 'GET') {
        const [neu, prod, total, upd] = await Promise.all([
          db.prepare("SELECT COUNT(*) c FROM contact_messages WHERE status='new'").first(),
          db.prepare('SELECT COUNT(*) c FROM products WHERE active = 1').first(),
          db.prepare('SELECT COUNT(*) c FROM contact_messages').first(),
          db.prepare('SELECT updated_at FROM site_content WHERE id = 1').first()
        ]);
        return ok({ new_messages: neu?.c || 0, total_messages: total?.c || 0, active_products: prod?.c || 0, content_updated_at: upd?.updated_at || null });
      }

      /* content */
      if (path === 'admin/content' && method === 'GET') {
        const row = await db.prepare('SELECT content, updated_at FROM site_content WHERE id = 1').first().catch(() => null);
        let content = null; try { content = row ? JSON.parse(row.content) : null; } catch (e) {}
        return ok({ content, updated_at: row?.updated_at || null });
      }
      if (path === 'admin/content' && method === 'PUT') {
        const b = await body();
        if (!b.content || typeof b.content !== 'object') return fail('Missing content object.');
        await db.prepare("INSERT INTO site_content (id, content, updated_by, updated_at) VALUES (1,?1,?2,datetime('now')) ON CONFLICT(id) DO UPDATE SET content=?1, updated_by=?2, updated_at=datetime('now')")
          .bind(JSON.stringify(b.content), admin.user_id).run();
        return ok({ saved: true });
      }

      /* products */
      if (path === 'admin/products' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM products ORDER BY sort_order ASC, title ASC').all();
        return ok({ products: (results || []).map(mapProduct) });
      }
      if (path === 'admin/products' && method === 'POST') {
        const b = await body();
        const f = normalizeProduct(b);
        const id = crypto.randomUUID();
        await db.prepare('INSERT INTO products (id,title,description,icon,tags,link,link_label,featured,external,active,sort_order) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)')
          .bind(id, f.title, f.description, f.icon, f.tags, f.link, f.link_label, f.featured, f.external, f.active, f.sort_order).run();
        const row = await db.prepare('SELECT * FROM products WHERE id = ?1').bind(id).first();
        return ok({ product: mapProduct(row) });
      }
      if (path === 'admin/products' && method === 'PUT') {
        const b = await body();
        if (!b.id) return fail('Missing product id.');
        const f = normalizeProduct(b);
        await db.prepare("UPDATE products SET title=?1,description=?2,icon=?3,tags=?4,link=?5,link_label=?6,featured=?7,external=?8,active=?9,sort_order=?10,updated_at=datetime('now') WHERE id=?11")
          .bind(f.title, f.description, f.icon, f.tags, f.link, f.link_label, f.featured, f.external, f.active, f.sort_order, b.id).run();
        return ok({ saved: true });
      }
      if (path === 'admin/products' && method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return fail('Missing id.');
        await db.prepare('DELETE FROM products WHERE id = ?1').bind(id).run();
        return ok({ deleted: true });
      }

      /* messages */
      if (path === 'admin/messages' && method === 'GET') {
        const status = url.searchParams.get('status') || 'all';
        let stmt;
        if (status === 'all') stmt = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC');
        else if (['new', 'read', 'archived'].includes(status)) stmt = db.prepare('SELECT * FROM contact_messages WHERE status = ?1 ORDER BY created_at DESC').bind(status);
        else return fail('Invalid status filter.');
        const { results } = await stmt.all();
        return ok({ messages: results || [] });
      }
      if (path === 'admin/messages' && method === 'PUT') {
        const b = await body();
        if (!b.id || !['new', 'read', 'archived'].includes(b.status)) return fail('Valid id and status are required.');
        await db.prepare('UPDATE contact_messages SET status = ?1 WHERE id = ?2').bind(b.status, b.id).run();
        return ok({ saved: true });
      }
      if (path === 'admin/messages' && method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return fail('Missing id.');
        await db.prepare('DELETE FROM contact_messages WHERE id = ?1').bind(id).run();
        return ok({ deleted: true });
      }

      /* change own password */
      if (path === 'admin/password' && method === 'POST') {
        const b = await body();
        const next = String(b.new_password || '');
        if (next.length < 10) return fail('New password must be at least 10 characters.');
        const row = await db.prepare('SELECT password_hash FROM admin_users WHERE id = ?1').bind(admin.user_id).first();
        const valid = row ? await verifyPassword(String(b.current_password || ''), row.password_hash) : false;
        if (!row || !valid) return fail('Your current password is incorrect.', 401);
        await db.prepare('UPDATE admin_users SET password_hash = ?1 WHERE id = ?2').bind(await hashPassword(next), admin.user_id).run();
        return ok({ changed: true });
      }
    }

    return fail('Not found.', 404);
  } catch (e) {
    return fail(e.message || 'Unexpected server error.', 500);
  }
}

function normalizeProduct(b) {
  return {
    title: String(b.title || 'Untitled product').slice(0, 160),
    description: String(b.description || '').slice(0, 2000),
    icon: String(b.icon || 'fas fa-cube').slice(0, 120),
    tags: JSON.stringify(Array.isArray(b.tags) ? b.tags.slice(0, 20) : []),
    link: String(b.link || '#').slice(0, 500),
    link_label: String(b.link_label || 'Learn more').slice(0, 80),
    featured: b.featured ? 1 : 0,
    external: b.external ? 1 : 0,
    active: b.active === false ? 0 : 1,
    sort_order: Number.isFinite(+b.sort_order) ? +b.sort_order : 0
  };
}

