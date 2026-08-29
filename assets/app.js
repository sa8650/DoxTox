/* ==========================================================================
   DoxTox Technologies Ltd. — app.js
   API client, default content, landing page, and admin dashboard.
   Talks to Cloudflare Pages Functions mounted at /api/dox/* .
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     1) API CLIENT
  ---------------------------------------------------------------------- */
  window.doxtox = window.doxtox || {};
  window.doxtox.api = (function () {
    const BASE = '/api/dox';
    async function request(method, path, body) {
      const opts = { method, headers: {}, credentials: 'same-origin' };
      if (body !== undefined) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
      }
      const res = await fetch(BASE + path, opts);
      let data = {};
      try { data = await res.json(); } catch (e) { /* non-JSON */ }
      if (!res.ok || data.ok === false) {
        const err = new Error(data.error || 'Request failed (' + res.status + ')');
        err.status = res.status;
        throw err;
      }
      return data;
    }
    return {
      get: (p) => request('GET', p),
      post: (p, b) => request('POST', p, b),
      put: (p, b) => request('PUT', p, b),
      del: (p) => request('DELETE', p)
    };
  })();

  /* ----------------------------------------------------------------------
     2) DEFAULT CONTENT (fallback if API unreachable; mirrors D1 seed)
  ---------------------------------------------------------------------- */
  window.DOXTOX_DEFAULT_CONTENT = {
    brand: { name: 'DoxTox', logo_icon: 'fas fa-bolt' },
    nav: { products: 'Products', features: 'Features', about: 'About', contact: 'Contact' },
    hero: {
      label: '🚀 Next‑gen software',
      title_1: 'Build smarter.',
      title_2_highlight: 'Ship faster.',
      subtitle: 'DoxTox crafts cutting‑edge digital products for startups and enterprises. From AI tools to scalable platforms — we bring your vision to life.',
      primary_btn: 'Explore products',
      primary_icon: 'fas fa-rocket',
      secondary_btn: 'Get in touch',
      secondary_icon: 'fas fa-arrow-right'
    },
    stats: [
      { value: '50+', label: 'Projects delivered' },
      { value: '98%', label: 'Client satisfaction' },
      { value: '24/7', label: 'Support & maintenance' }
    ],
    badges: [
      { icon: 'fas fa-robot', title: 'AI‑powered', subtitle: 'Intelligent automation' },
      { icon: 'fas fa-cloud-upload-alt', title: 'Cloud‑native', subtitle: 'Scale on demand' }
    ],
    code_block: [
      { dot: 'green', html: '<span class="keyword">import</span> { DoxTox } <span class="keyword">from</span> <span class="string">\'@dox/kit\'</span>;' },
      { dot: 'purple', html: '<span class="keyword">const</span> <span class="variable">app</span> = <span class="keyword">new</span> <span class="function">DoxTox</span>({' },
      { dot: 'cyan', html: '&nbsp;&nbsp;<span class="variable">name</span>: <span class="string">\'Nova\'</span>,' },
      { dot: 'green', html: '&nbsp;&nbsp;<span class="variable">scale</span>: <span class="string">\'enterprise\'</span>,' },
      { dot: 'purple', html: '&nbsp;&nbsp;<span class="variable">features</span>: [<span class="string">\'AI\'</span>, <span class="string">\'real‑time\'</span>, <span class="string">\'analytics\'</span>]' },
      { dot: 'cyan', html: '}); <span class="comment">// ready to deploy 🚀</span>' }
    ],
    products_section: {
      label: '📦 Our products',
      title: 'Built for **performance** & **scale**',
      subtitle: 'Each product is engineered with modern stacks, clean APIs, and a developer‑first experience.'
    },
    features_section: { label: '⚡ Why DoxTox', title: 'Engineered for **excellence**' },
    features: [
      { icon: 'fas fa-code', title: 'Clean code', text: 'Maintainable, tested, and documented codebases.' },
      { icon: 'fas fa-cloud', title: 'Cloud‑ready', text: 'AWS, GCP, Azure — we deploy anywhere.' },
      { icon: 'fas fa-lock', title: 'Security first', text: 'Zero‑trust, encryption, and regular audits.' },
      { icon: 'fas fa-people-arrows', title: 'Team collaboration', text: 'Agile workflows with transparent communication.' }
    ],
    about: {
      label: '👋 About us',
      title_1: 'We turn complex',
      title_2_highlight: 'ideas into reality',
      paragraphs: ['DoxTox Technologies Ltd. is a team of senior engineers, architects, and product strategists. We partner with founders and enterprises to design, build, and scale software that drives real business impact.'],
      checks: ['50+ successful projects', '15+ tech stacks mastered', '100% client retention'],
      cta: 'Work with us', cta_icon: 'fas fa-handshake'
    },
    contact: {
      label: "📬 Let's talk",
      title: 'Ready to build **something great?**',
      info_title: 'Get in touch',
      info_text: 'Whether you have a project in mind or just want to explore possibilities — we\'d love to hear from you.',
      email: 'hello@doxtox.example',
      phone: '+1 (800) 555‑0000',
      address: 'Your city, Country',
      socials: [
        { icon: 'fab fa-github', url: 'https://github.com/doxtox', label: 'GitHub' },
        { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/company/doxtox', label: 'LinkedIn' },
        { icon: 'fab fa-x-twitter', url: 'https://x.com/doxtox', label: 'X' },
        { icon: 'fab fa-youtube', url: 'https://youtube.com/@doxtox', label: 'YouTube' }
      ]
    },
    footer: {
      tagline: 'Crafting the future of software.',
      links: [
        { label: 'Privacy', url: '#' }, { label: 'Terms', url: '#' },
        { label: 'Security', url: '#' }, { label: 'Contact', url: '#contact' }
      ]
    }
  };
  window.DOXTOX_DEFAULT_PRODUCTS = [
    { id: 'zudo', title: 'Zudo AI', description: 'Enterprise‑grade AI assistant that automates workflows, generates insights, and integrates with your data stack.', icon: 'fas fa-brain', tags: ['Python', 'TensorFlow', 'REST'], link: '#', link_label: 'Learn more', featured: false, external: false, sort_order: 10 },
    { id: 'ems', title: 'EMS', description: 'Complete multi‑store management system with unified inventory, centralized order tracking, and real‑time analytics across all locations.', icon: 'fas fa-store-alt', tags: ['React', 'Node.js', 'Multi‑tenant'], link: 'ems.html', link_label: 'Explore EMS', featured: true, external: false, sort_order: 20 },
    { id: 'infl', title: 'InfluencerOS', description: 'Partner & influencer management platform — allocate project targets, track acquired users, calculate commissions and run balance‑safe partner payouts.', icon: 'fas fa-bullhorn', tags: ['Partners', 'Projects', 'Payouts'], link: 'influenceros/', link_label: 'Open InfluencerOS', featured: false, external: false, sort_order: 30 }
  ];

  /* ----------------------------------------------------------------------
     SHARED HELPERS
  ---------------------------------------------------------------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function deepMerge(base, override) {
    const out = Object.assign({}, base);
    Object.keys(override || {}).forEach((k) => {
      const bv = base ? base[k] : undefined;
      const ov = override[k];
      if (Array.isArray(ov)) out[k] = ov.slice();
      else if (ov && typeof ov === 'object' && bv && typeof bv === 'object' && !Array.isArray(bv)) out[k] = deepMerge(bv, ov);
      else out[k] = ov;
    });
    return out;
  }
  function setText(el, t) { if (el && t != null) el.textContent = t; }
  function setRich(el, text) {
    if (!el || text == null) return;
    el.textContent = '';
    String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean).forEach((part) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        const s = document.createElement('span');
        s.className = 'highlight';
        s.textContent = part.slice(2, -2);
        el.appendChild(s);
      } else el.appendChild(document.createTextNode(part));
    });
  }
  function toast(message, type) {
    const area = document.getElementById('toastArea');
    if (!area) return;
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'err' ? 'err' : 'ok');
    el.innerHTML = '<i class="fas ' + (type === 'err' ? 'fa-circle-exclamation' : 'fa-circle-check') + '"></i><span>' + esc(message) + '</span>';
    area.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3200);
  }
  function timeAgo(iso) {
    if (!iso) return '–';
    const d = new Date(String(iso).replace(' ', 'T') + (String(iso).includes('Z') ? '' : 'Z'));
    if (isNaN(d.getTime())) return '–';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 86400 * 30) return Math.floor(diff / 86400) + 'd ago';
    return d.toLocaleDateString();
  }

  /* ======================================================================
     3) LANDING PAGE  (only runs on index.html — guarded by body class)
  ====================================================================== */
  const Landing = (function () {
    let content = window.DOXTOX_DEFAULT_CONTENT;
    let products = window.DOXTOX_DEFAULT_PRODUCTS.slice();

    function releaseLoading() {
      if (typeof window.__doxRelease === 'function') window.__doxRelease();
      document.body.classList.remove('content-loading');
    }

    function renderProducts() {
      const grid = $('[data-products-grid]');
      if (!grid) return;
      grid.innerHTML = ''; // replace, never append over old cards
      products.filter(Boolean).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).forEach((p) => {
        if (p.active === false) return;
        const tags = (p.tags || []).map((t) => '<span>' + esc(t) + '</span>').join('');
        const href = p.link && p.link !== '#' ? p.link : '#contact';
        const ext = p.external ? ' target="_blank" rel="noopener noreferrer"' : '';
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML =
          (p.featured ? '<div class="featured-badge">⭐ featured</div>' : '') +
          '<div class="icon"><i class="' + esc(p.icon || 'fas fa-cube') + '"></i></div>' +
          '<h3>' + esc(p.title) + '</h3><p>' + esc(p.description || '') + '</p>' +
          (tags ? '<div class="tags">' + tags + '</div>' : '') +
          '<a href="' + esc(href) + '" class="product-link"' + ext + '>' + esc(p.link_label || 'Learn more') +
          ' <i class="fas fa-arrow-right"></i></a>';
        grid.appendChild(card);
      });
    }
    function renderFeatures() {
      const grid = $('[data-features-grid]');
      if (!grid || !content.features) return;
      grid.innerHTML = ''; // replace, never append over old items
      content.features.forEach((f) => {
        const item = document.createElement('div');
        item.className = 'feature-item';
        item.innerHTML = '<i class="' + esc(f.icon || 'fas fa-check') + '"></i><div><h4>' + esc(f.title) + '</h4><p>' + esc(f.text || '') + '</p></div>';
        grid.appendChild(item);
      });
    }
    function renderStats() {
      const wrap = $('[data-stats]');
      if (!wrap || !content.stats) return;
      wrap.innerHTML = content.stats.map((s) => '<div class="stat"><h3>' + esc(s.value) + '</h3><p>' + esc(s.label) + '</p></div>').join('');
    }
    function renderBadges() {
      const anchor = $('[data-badges]');
      if (!anchor || !content.badges) return;
      const visual = anchor.parentElement;
      $$('.floating-badge', visual).forEach((b) => b.remove());
      content.badges.forEach((b, i) => {
        const el = document.createElement('div');
        el.className = 'floating-badge floating-badge--' + (i + 1);
        if (i >= 2) el.style.animationDelay = i + 's';
        el.innerHTML = '<i class="' + esc(b.icon || 'fas fa-star') + '"></i><div><span>' + esc(b.title) + '</span><small>' + esc(b.subtitle || '') + '</small></div>';
        visual.appendChild(el);
      });
    }
    function renderCodeBlock() {
      const wrap = $('[data-code-block]');
      if (!wrap || !content.code_block) return;
      wrap.innerHTML = content.code_block.map((l) => '<div class="code-line"><span class="dot ' + esc(l.dot || 'green') + '"></span> ' + l.html + '</div>').join('');
    }
    function renderSocials() {
      const wrap = $('[data-social-links]');
      if (!wrap || !content.contact || !content.contact.socials) return;
      wrap.innerHTML = content.contact.socials.map((s) =>
        '<a href="' + esc(s.url || '#') + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(s.label || 'Social') + '"><i class="' + esc(s.icon || 'fas fa-link') + '"></i></a>').join('');
    }
    function renderFooterLinks() {
      const wrap = $('[data-footer-links]');
      if (!wrap || !content.footer || !content.footer.links) return;
      wrap.innerHTML = content.footer.links.map((l) => '<li><a href="' + esc(l.url || '#') + '">' + esc(l.label) + '</a></li>').join('');
    }
    function renderBrand() {
      const name = (content.brand && content.brand.name) || 'DoxTox';
      // Browser tab + social/SEO tags use the editable brand name everywhere.
      document.title = name + ' Technologies Ltd.';
      const og = document.querySelector('meta[property="og:site_name"]');
      if (og) og.setAttribute('content', name + ' Technologies Ltd.');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && content.hero) ogTitle.setAttribute('content', name + ' — ' + (content.hero.title_1 || '') + ' ' + (content.hero.title_2_highlight || ''));
    }
    function renderContent() {
      const c = content;
      renderBrand();
      setText($('[data-brand-name]'), c.brand && c.brand.name);
      setText($('[data-footer-brand]'), c.brand && c.brand.name);
      const bi = $('[data-brand-icon]'); if (bi && c.brand && c.brand.logo_icon) bi.className = c.brand.logo_icon;
      setText($('[data-nav="products"]'), c.nav && c.nav.products);
      setText($('[data-nav="features"]'), c.nav && c.nav.features);
      setText($('[data-nav="about"]'), c.nav && c.nav.about);
      setText($('[data-nav="contact"]'), c.nav && c.nav.contact);
      setText($('[data-hero-label]'), c.hero && c.hero.label);
      setText($('[data-hero-title1]'), c.hero && c.hero.title_1);
      setText($('[data-hero-title2]'), c.hero && c.hero.title_2_highlight);
      setText($('[data-hero-subtitle]'), c.hero && c.hero.subtitle);
      setText($('[data-hero-primary-label]'), c.hero && c.hero.primary_btn);
      setText($('[data-hero-secondary-label]'), c.hero && c.hero.secondary_btn);
      const pi = $('[data-hero-primary-icon]'); if (pi && c.hero && c.hero.primary_icon) pi.className = c.hero.primary_icon;
      const si = $('[data-hero-secondary-icon]'); if (si && c.hero && c.hero.secondary_icon) si.className = c.hero.secondary_icon + ' icon-right';
      setText($('[data-products-label]'), c.products_section && c.products_section.label);
      setRich($('[data-products-title]'), c.products_section && c.products_section.title);
      setText($('[data-products-subtitle]'), c.products_section && c.products_section.subtitle);
      setText($('[data-features-label]'), c.features_section && c.features_section.label);
      setRich($('[data-features-title]'), c.features_section && c.features_section.title);
      setText($('[data-about-label]'), c.about && c.about.label);
      setText($('[data-about-title1]'), c.about && c.about.title_1);
      setText($('[data-about-title2]'), c.about && c.about.title_2_highlight);
      if (c.about && Array.isArray(c.about.paragraphs)) $('[data-about-paragraphs]').innerHTML = c.about.paragraphs.map((p) => '<p>' + esc(p) + '</p>').join('');
      if (c.about && Array.isArray(c.about.checks)) $('[data-about-checks]').innerHTML = c.about.checks.map((ch) => '<li><i class="fas fa-check-circle"></i> ' + esc(ch) + '</li>').join('');
      setText($('[data-about-cta-label]'), c.about && c.about.cta);
      const ai = $('[data-about-cta-icon]'); if (ai && c.about && c.about.cta_icon) ai.className = c.about.cta_icon;
      const ct = c.contact || {};
      setText($('[data-contact-label]'), ct.label);
      setRich($('[data-contact-title]'), ct.title);
      setText($('[data-contact-info-title]'), ct.info_title);
      setText($('[data-contact-info-text]'), ct.info_text);
      const emailEl = $('[data-contact-email]');
      if (emailEl && ct.email) { emailEl.textContent = ct.email; emailEl.href = 'mailto:' + ct.email; }
      setText($('[data-contact-phone]'), ct.phone);
      setText($('[data-contact-address]'), ct.address);
      setText($('[data-footer-tagline]'), c.footer && c.footer.tagline);
      setText($('[data-year]'), String(new Date().getFullYear()));
      renderStats(); renderBadges(); renderCodeBlock(); renderFeatures();
      renderSocials(); renderFooterLinks(); renderProducts();
      releaseLoading(); // reveal everything only after saved content is in place
    }
    async function load() {
      try {
        const data = await window.doxtox.api.get('/content');
        if (data && data.content) content = deepMerge(window.DOXTOX_DEFAULT_CONTENT, data.content);
      } catch (e) { console.warn('[DoxTox] content fallback:', e.message); }
      try {
        const data = await window.doxtox.api.get('/products');
        if (data && data.products && data.products.length) products = data.products;
      } catch (e) { console.warn('[DoxTox] products fallback:', e.message); }
      renderContent();
    }
    function initNav() {
      const hamburger = $('#hamburger'), navLinks = $('#navLinks'), header = $('#header');
      if (!hamburger) return;
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open') ? 'true' : 'false');
      });
      $$('.nav-links a').forEach((l) => l.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('open'); }));
      window.addEventListener('scroll', () => { if (window.pageYOffset > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled'); });
    }
    function initContactForm() {
      const form = $('#contactForm');
      if (!form) return;
      const status = $('#formStatus'), btn = $('#contactSubmit');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.className = 'form-status'; status.textContent = '';
        const el = form.elements;
        const name = el['name'].value.trim(), email = el['email'].value.trim();
        const company = el['company'].value.trim(), message = el['message'].value.trim();
        const website = el['website'].value;
        if (website) { status.className = 'form-status ok'; status.textContent = 'Thanks! Your message has been sent.'; form.reset(); return; }
        if (!name || !email || !message) { status.className = 'form-status err'; status.textContent = 'Please fill in your name, email and message.'; return; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status.className = 'form-status err'; status.textContent = 'Please enter a valid email address.'; return; }
        const original = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        try {
          await window.doxtox.api.post('/messages', { name, email, company, message, website });
          btn.className = 'btn btn-success'; btn.innerHTML = '<i class="fas fa-check"></i> Message sent!';
          status.className = 'form-status ok'; status.textContent = "Thanks! We'll get back to you soon.";
          form.reset();
          setTimeout(() => { btn.className = 'btn btn-primary'; btn.innerHTML = original; btn.disabled = false; }, 2500);
        } catch (err) {
          status.className = 'form-status err'; status.textContent = 'Something went wrong. Please email us directly or try again later.';
          btn.innerHTML = original; btn.disabled = false;
        }
      });
    }
    function initReveal() {
      if (!('IntersectionObserver' in window)) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.style.opacity = '1'; en.target.style.transform = 'translateY(0)'; obs.unobserve(en.target); } });
      }, { threshold: 0.12 });
      $$('.product-card, .feature-item, .about-grid, .contact-wrapper, .hero-stats, .hero-code-block').forEach((el) => {
        el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity .7s ease, transform .7s ease';
        obs.observe(el);
      });
    }
    function init() { initNav(); initContactForm(); load().then(initReveal); }
    return { init };
  })();

  /* ======================================================================
     4) ADMIN — login / setup / dashboard on admin.html
  ====================================================================== */
  const Admin = (function () {
    let content = null, products = [], messages = [], currentUser = null, LIST_DEFS;

    function getPath(o, p) { return p.split('.').reduce((x, k) => (x == null ? x : x[k]), o); }
    function setPath(o, p, v) {
      const ks = p.split('.'); let cur = o;
      for (let i = 0; i < ks.length - 1; i++) { if (cur[ks[i]] == null || typeof cur[ks[i]] !== 'object') cur[ks[i]] = {}; cur = cur[ks[i]]; }
      cur[ks[ks.length - 1]] = v;
    }
    function buildListDefs() {
      return {
        stats: { container: $('[data-list="stats"]'), blank: { value: '', label: '' },
          fields: [{ key: 'value', placeholder: 'Value e.g. 50+', narrow: true }, { key: 'label', placeholder: 'Label e.g. Projects delivered' }],
          read: (i) => ({ value: i.value.value.trim(), label: i.label.value.trim() }) },
        badges: { container: $('[data-list="badges"]'), blank: { icon: 'fas fa-star', title: '', subtitle: '' },
          fields: [{ key: 'icon', placeholder: 'Icon class', icon: true }, { key: 'title', placeholder: 'Title' }, { key: 'subtitle', placeholder: 'Subtitle' }],
          read: (i) => ({ icon: i.icon.value.trim() || 'fas fa-star', title: i.title.value.trim(), subtitle: i.subtitle.value.trim() }) },
        features: { container: $('[data-list="features"]'), blank: { icon: 'fas fa-check', title: '', text: '' },
          fields: [{ key: 'icon', placeholder: 'Icon class', icon: true }, { key: 'title', placeholder: 'Feature title' }, { key: 'text', placeholder: 'Short description' }],
          read: (i) => ({ icon: i.icon.value.trim() || 'fas fa-check', title: i.title.value.trim(), text: i.text.value.trim() }) },
        'about.checks': { container: $('[data-list="about.checks"]'), path: 'about.checks', blank: 'New checklist item',
          fields: [{ key: 'text', placeholder: 'Checklist item' }], read: (i) => i.text.value.trim() },
        'contact.socials': { container: $('[data-list="contact.socials"]'), path: 'contact.socials', blank: { icon: 'fas fa-link', label: '', url: '' },
          fields: [{ key: 'icon', placeholder: 'Icon class', icon: true }, { key: 'label', placeholder: 'Label e.g. LinkedIn' }, { key: 'url', placeholder: 'https://…' }],
          read: (i) => ({ icon: i.icon.value.trim() || 'fas fa-link', label: i.label.value.trim(), url: i.url.value.trim() }) },
        'footer.links': { container: $('[data-list="footer.links"]'), path: 'footer.links', blank: { label: '', url: '#' },
          fields: [{ key: 'label', placeholder: 'Link label' }, { key: 'url', placeholder: 'URL or #anchor' }],
          read: (i) => ({ label: i.label.value.trim(), url: i.url.value.trim() || '#' }) }
      };
    }
    function makeListRow(def, item) {
      const row = document.createElement('div'); row.className = 'editor-row';
      const inputs = {};
      def.fields.forEach((f) => {
        const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = f.placeholder;
        inp.className = f.narrow ? 'w-narrow' : f.icon ? 'icon-input' : '';
        inp.value = typeof item === 'string' ? item : item[f.key] != null ? item[f.key] : '';
        inp.dataset.key = f.key; row.appendChild(inp); inputs[f.key] = inp;
      });
      const del = document.createElement('button'); del.type = 'button'; del.className = 'icon-btn danger';
      del.innerHTML = '<i class="fas fa-trash"></i>'; del.title = 'Remove';
      del.addEventListener('click', () => row.remove());
      row.appendChild(del);
      return row;
    }
    function renderList(key) {
      const def = LIST_DEFS[key]; if (!def || !def.container) return;
      let data = def.path ? getPath(content, def.path) : content[key];
      if (!Array.isArray(data)) data = [];
      def.container.innerHTML = '';
      data.forEach((item) => def.container.appendChild(makeListRow(def, item)));
    }
    function readList(key) {
      const def = LIST_DEFS[key]; if (!def || !def.container) return [];
      const out = [];
      $$('.editor-row', def.container).forEach((row) => {
        const inputs = {};
        $$('input', row).forEach((inp) => { inputs[inp.dataset.key] = inp; });
        const val = def.read(inputs);
        const empty = typeof val === 'string' ? val === '' : Object.keys(val).every((k) => (k === 'icon' || k === 'url' ? false : String(val[k] || '').trim() === ''));
        if (!empty) out.push(val);
      });
      return out;
    }
    function hydrateForms() {
      $$('[data-path]').forEach((inp) => {
        if (inp.dataset.path === 'about.paragraphs_text') inp.value = (content.about.paragraphs || []).join('\n');
        else { const v = getPath(content, inp.dataset.path); inp.value = v == null ? '' : v; }
      });
      Object.keys(LIST_DEFS).forEach(renderList);
    }
    function collectForm(scope) {
      $$('[data-path]', scope).forEach((inp) => {
        if (inp.dataset.path === 'about.paragraphs_text')
          content.about.paragraphs = inp.value.split('\n').map((s) => s.trim()).filter(Boolean);
        else setPath(content, inp.dataset.path, inp.value);
      });
      $$('[data-list]', scope).forEach((listEl) => {
        const def = LIST_DEFS[listEl.dataset.list]; if (!def) return;
        const val = readList(listEl.dataset.list);
        if (def.path) setPath(content, def.path, val); else content[listEl.dataset.list] = val;
      });
    }
    async function saveContent(formEl) {
      collectForm(formEl);
      const btn = formEl.querySelector('button[type="submit"]'); const orig = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
      try {
        await window.doxtox.api.put('/admin/content', { content });
        toast('Saved — changes are live on the website.'); refreshOverview();
      } catch (e) { toast('Save failed: ' + e.message, 'err'); }
      finally { btn.disabled = false; btn.innerHTML = orig; }
    }

    /* ---------- products ---------- */
    function productFormHtml(p) {
      const tags = Array.isArray(p.tags) ? p.tags.join(', ') : '';
      return '<div class="form-grid">' +
        '<div class="field"><label>Title</label><input class="p-title-inp" type="text" value="' + esc(p.title) + '" /></div>' +
        '<div class="field"><label>Icon (Font Awesome class)</label><input class="p-icon-inp" type="text" value="' + esc(p.icon || 'fas fa-cube') + '" /></div>' +
        '<div class="field full"><label>Description</label><textarea class="p-desc">' + esc(p.description || '') + '</textarea></div>' +
        '<div class="field"><label>Tags (comma separated)</label><input class="p-tags" type="text" value="' + esc(tags) + '" /></div>' +
        '<div class="field"><label>Sort order (lower = first)</label><input class="p-sort" type="number" value="' + esc(p.sort_order != null ? p.sort_order : 0) + '" /></div>' +
        '<div class="field"><label>Link</label><input class="p-link" type="text" value="' + esc(p.link || '#') + '" /></div>' +
        '<div class="field"><label>Link button text</label><input class="p-linklabel" type="text" value="' + esc(p.link_label || 'Learn more') + '" /></div>' +
        '<label class="checkbox-row full"><input type="checkbox" class="p-featured" ' + (p.featured ? 'checked' : '') + ' /> Show “⭐ featured” badge</label>' +
        '<label class="checkbox-row full"><input type="checkbox" class="p-external" ' + (p.external ? 'checked' : '') + ' /> Open link in a new tab (external site)</label>' +
        '<label class="checkbox-row full"><input type="checkbox" class="p-active" ' + (p.active !== false ? 'checked' : '') + ' /> Visible on the website</label>' +
        '</div>';
    }
    function renderProducts() {
      const wrap = $('#productList'); wrap.innerHTML = '';
      products.slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).forEach((p) => {
        const det = document.createElement('details'); det.className = 'product-admin';
        det.innerHTML = '<summary><span class="p-icon"><i class="' + esc(p.icon || 'fas fa-cube') + '"></i></span>' +
          '<span class="p-title">' + esc(p.title) + '<small>' + esc((p.tags || []).join(' · ')) + '</small></span>' +
          (p.featured ? '<span class="pill featured">Featured</span>' : '') +
          (p.active === false ? '<span class="pill inactive">Hidden</span>' : '') + '</summary>' +
          productFormHtml(p) +
          '<div class="product-actions">' +
          '<button type="button" class="btn btn-danger btn-sm p-delete"><i class="fas fa-trash"></i> Delete</button>' +
          '<button type="button" class="btn btn-primary btn-sm p-save"><i class="fas fa-save"></i> Save product</button></div>';
        $('.p-save', det).addEventListener('click', () => saveProduct(p.id, det));
        $('.p-delete', det).addEventListener('click', () => deleteProduct(p.id, p.title));
        wrap.appendChild(det);
      });
    }
    function readProductForm(det) {
      return {
        title: $('.p-title-inp', det).value.trim() || 'Untitled product',
        icon: $('.p-icon-inp', det).value.trim() || 'fas fa-cube',
        description: $('.p-desc', det).value.trim(),
        tags: $('.p-tags', det).value.split(',').map((t) => t.trim()).filter(Boolean),
        sort_order: parseInt($('.p-sort', det).value, 10) || 0,
        link: $('.p-link', det).value.trim() || '#',
        link_label: $('.p-linklabel', det).value.trim() || 'Learn more',
        featured: $('.p-featured', det).checked,
        external: $('.p-external', det).checked,
        active: $('.p-active', det).checked
      };
    }
    async function saveProduct(id, det) {
      const btn = $('.p-save', det);
      let data;
      try { data = readProductForm(det); }
      catch (e) { toast('Could not read the product form: ' + e.message, 'err'); return; }
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      try {
        await window.doxtox.api.put('/admin/products', Object.assign({ id }, data));
        toast('“' + data.title + '” saved.'); await loadProducts(); renderProducts(); refreshOverview();
      } catch (e) { toast('Update failed: ' + e.message, 'err'); btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Save product'; }
    }
    async function createProduct() {
      const sort_order = (products.reduce((m, p) => Math.max(m, p.sort_order || 0), 0) || 0) + 10;
      try {
        const res = await window.doxtox.api.post('/admin/products', { title: 'New product', description: '', icon: 'fas fa-cube', tags: [], link: '#', link_label: 'Learn more', featured: false, external: false, active: true, sort_order });
        products.push(res.product); renderProducts();
        const dets = $$('#productList details'); if (dets[dets.length - 1]) dets[dets.length - 1].open = true;
        toast('Product created — edit it now.'); refreshOverview();
      } catch (e) { toast('Could not create product: ' + e.message, 'err'); }
    }
    async function deleteProduct(id, title) {
      if (!confirm('Delete “' + title + '”? This cannot be undone.')) return;
      try {
        await window.doxtox.api.del('/admin/products?id=' + encodeURIComponent(id));
        toast('“' + title + '” deleted.'); await loadProducts(); renderProducts(); refreshOverview();
      } catch (e) { toast('Delete failed: ' + e.message, 'err'); }
    }
    async function loadProducts() { const res = await window.doxtox.api.get('/admin/products'); products = res.products || []; }

    /* ---------- messages ---------- */
    async function loadMessages() {
      const filter = $('#msgFilter').value;
      const res = await window.doxtox.api.get('/admin/messages?status=' + encodeURIComponent(filter));
      messages = res.messages || []; renderMessages(); updateMsgBadge();
    }
    function updateMsgBadge() {
      // count "new" across all
      window.doxtox.api.get('/admin/messages?status=new').then((res) => {
        const count = (res.messages || []).length; const badge = $('#msgBadge');
        if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); } else badge.classList.add('hidden');
      }).catch(() => {});
    }
    function renderMessages() {
      const filter = $('#msgFilter').value, list = $('#msgList');
      if (!messages.length) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No ' + (filter === 'all' ? '' : filter + ' ') + 'messages.</p></div>';
        return;
      }
      list.innerHTML = '';
      messages.forEach((m) => {
        const card = document.createElement('div');
        card.className = 'msg-card ' + (m.status !== 'new' ? m.status : '');
        const when = new Date(String(m.created_at).replace(' ', 'T') + (String(m.created_at).includes('Z') ? '' : 'Z'));
        card.innerHTML =
          '<div class="msg-head"><div class="who">' + esc(m.name) +
          '<a href="mailto:' + esc(m.email) + '"><i class="fas fa-envelope"></i> ' + esc(m.email) + '</a></div>' +
          '<div class="when">' + (isNaN(when.getTime()) ? esc(m.created_at) : when.toLocaleString()) + ' · ' + timeAgo(m.created_at) + '</div></div>' +
          (m.company ? '<div class="msg-company"><i class="fas fa-building"></i> ' + esc(m.company) + '</div>' : '') +
          '<div class="msg-body">' + esc(m.message) + '</div><div class="msg-actions">' +
          (m.status === 'new' ? '<button class="btn btn-sm btn-ghost m-read"><i class="fas fa-check"></i> Mark read</button>' : '') +
          (m.status !== 'archived' ? '<button class="btn btn-sm btn-ghost m-archive"><i class="fas fa-box-archive"></i> Archive</button>' : '<button class="btn btn-sm btn-ghost m-unarchive"><i class="fas fa-rotate-left"></i> Unarchive</button>') +
          '<button class="btn btn-sm btn-danger m-delete"><i class="fas fa-trash"></i> Delete</button></div>';
        $('.m-read', card) && $('.m-read', card).addEventListener('click', () => setStatus(m.id, 'read'));
        $('.m-archive', card) && $('.m-archive', card).addEventListener('click', () => setStatus(m.id, 'archived'));
        $('.m-unarchive', card) && $('.m-unarchive', card).addEventListener('click', () => setStatus(m.id, 'read'));
        $('.m-delete', card).addEventListener('click', () => { if (confirm('Delete this message permanently?')) deleteMessage(m.id); });
        list.appendChild(card);
      });
    }
    async function setStatus(id, status) {
      try {
        await window.doxtox.api.put('/admin/messages', { id, status });
        const m = messages.find((x) => x.id === id); if (m) m.status = status;
        renderMessages(); updateMsgBadge(); refreshOverview();
      } catch (e) { toast('Update failed: ' + e.message, 'err'); }
    }
    async function deleteMessage(id) {
      try {
        await window.doxtox.api.del('/admin/messages?id=' + encodeURIComponent(id));
        messages = messages.filter((m) => m.id !== id); renderMessages(); updateMsgBadge(); refreshOverview(); toast('Message deleted.');
      } catch (e) { toast('Delete failed: ' + e.message, 'err'); }
    }

    /* ---------- admin users ---------- */
    let admins = [];
    async function loadAdmins() {
      const res = await window.doxtox.api.get('/admin/admins');
      admins = res.admins || []; renderAdmins();
    }
    function renderAdmins() {
      const wrap = $('#adminList'); if (!wrap) return;
      wrap.innerHTML = '';
      admins.forEach((u) => {
        const card = document.createElement('div');
        card.className = 'msg-card admin-row' + (u.active ? '' : ' disabled');
        card.innerHTML =
          '<div class="msg-head"><div class="who">' + esc(u.email) +
          (u.is_self ? ' <span class="pill featured">You</span>' : '') +
          (u.active ? '' : ' <span class="pill inactive">Disabled</span>') + '</div>' +
          '<div class="when">Created ' + esc(timeAgo(u.created_at)) + (u.last_login ? ' · Last login ' + esc(timeAgo(u.last_login)) : '') + '</div></div>';
        const actions = document.createElement('div');
        actions.className = 'msg-actions';
        // Edit / reset password
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn btn-sm btn-ghost';
        resetBtn.innerHTML = '<i class="fas fa-key"></i> Reset password';
        resetBtn.addEventListener('click', () => resetAdminPassword(u));
        // Enable / disable
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn btn-sm ' + (u.active ? 'btn-ghost' : 'btn-primary');
        if (!u.is_self && u.active) toggleBtn.innerHTML = '<i class="fas fa-ban"></i> Disable';
        else if (u.is_self) { toggleBtn.innerHTML = '<i class="fas fa-ban"></i> Disable'; toggleBtn.disabled = true; toggleBtn.title = 'You cannot disable your own account'; }
        else toggleBtn.innerHTML = '<i class="fas fa-circle-check"></i> Enable';
        toggleBtn.addEventListener('click', () => toggleAdmin(u, !u.active));
        // Delete
        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm btn-danger';
        delBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
        if (u.is_self) { delBtn.disabled = true; delBtn.title = 'You cannot delete yourself'; }
        else delBtn.addEventListener('click', () => deleteAdmin(u));
        actions.appendChild(resetBtn); actions.appendChild(toggleBtn); actions.appendChild(delBtn);
        card.appendChild(actions);
        wrap.appendChild(card);
      });
    }
    async function toggleAdmin(u, active) {
      const verb = active ? 'enable' : 'disable';
      if (!active && !confirm('Disable “' + u.email + '”? They will be signed out immediately and unable to log in until re-enabled.')) return;
      try {
        await window.doxtox.api.put('/admin/admins', { id: u.id, active });
        toast(active ? '“' + u.email + '” enabled.' : '“' + u.email + '” disabled.');
        await loadAdmins();
      } catch (e) { toast('Could not ' + verb + ': ' + e.message, 'err'); }
    }
    async function deleteAdmin(u) {
      if (!confirm('Delete admin “' + u.email + '” permanently? Their password and sessions will be removed.')) return;
      try {
        await window.doxtox.api.del('/admin/admins?id=' + encodeURIComponent(u.id));
        toast('“' + u.email + '” deleted.'); await loadAdmins();
      } catch (e) { toast('Delete failed: ' + e.message, 'err'); }
    }
    function resetAdminPassword(u) {
      const pw = prompt('Enter a new password for ' + u.email + ' (at least 10 characters):');
      if (pw === null) return;
      if (pw.length < 10) { toast('Password must be at least 10 characters.', 'err'); return; }
      window.doxtox.api.put('/admin/admins', { id: u.id, password: pw })
        .then(() => toast('Password for “' + u.email + '” updated.'))
        .catch((e) => toast('Could not update password: ' + e.message, 'err'));
    }
    function initAdmins() {
      $('#addAdminBtn').addEventListener('click', () => {
        const card = $('#adminAddCard'); card.style.display = card.style.display === 'none' ? '' : 'none';
        if (card.style.display !== 'none') $('#newAdminEmail').focus();
      });
      $('#cancelAddAdmin').addEventListener('click', () => { $('#adminAddCard').style.display = 'none'; document.getElementById('formAddAdmin').reset(); });
      $('#formAddAdmin').addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = $('#addAdminStatus'), btn = e.target.querySelector('button[type="submit"]');
        status.className = 'form-status'; status.textContent = '';
        const email = $('#newAdminEmail').value.trim(), password = $('#newAdminPassword').value, active = $('#newAdminActive').checked;
        if (password.length < 10) { status.className = 'form-status err'; status.textContent = 'Password must be at least 10 characters.'; return; }
        btn.disabled = true;
        try {
          await window.doxtox.api.post('/admin/admins', { email, password, active });
          status.className = 'form-status ok'; status.textContent = 'Admin “' + email + '” created.';
          e.target.reset(); $('#adminAddCard').style.display = 'none'; await loadAdmins();
        } catch (err) { status.className = 'form-status err'; status.textContent = err.message; }
        finally { btn.disabled = false; }
      });
    }

    /* ---------- overview / tabs ---------- */
    async function refreshOverview() {
      try {
        const s = await window.doxtox.api.get('/admin/stats');
        $('#statMessages').textContent = s.new_messages != null ? s.new_messages : '–';
        $('#statProducts').textContent = s.active_products != null ? s.active_products : '–';
        const u = $('#statUpdated'); u.textContent = s.content_updated_at ? timeAgo(s.content_updated_at) : 'never';
        u.style.fontSize = s.content_updated_at ? '' : '1rem';
        updateMsgBadge();
      } catch (e) { /* best-effort */ }
    }
    function initTabs() {
      $$('#sideNav button').forEach((btn) => btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        $$('#sideNav button').forEach((b) => b.classList.toggle('active', b === btn));
        $$('.tab-pane').forEach((p) => p.classList.toggle('active', p.id === 'tab-' + tab));
        if (tab === 'messages') loadMessages().catch((e) => toast('Could not load messages: ' + e.message, 'err'));
        if (tab === 'admins') loadAdmins().catch((e) => toast('Could not load admins: ' + e.message, 'err'));
        if (tab === 'overview') refreshOverview();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }));
    }
    function initPasswordForm() {
      const f = $('#formPassword'); if (!f) return;
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = $('#pwStatus'), btn = f.querySelector('button[type="submit"]');
        const current_password = $('#curPw').value, new_password = $('#newPw').value, confirm = $('#newPw2').value;
        status.className = 'form-status'; status.textContent = '';
        if (new_password !== confirm) { status.className = 'form-status err'; status.textContent = 'New passwords do not match.'; return; }
        if (new_password.length < 10) { status.className = 'form-status err'; status.textContent = 'New password must be at least 10 characters.'; return; }
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating…';
        try {
          await window.doxtox.api.post('/admin/password', { current_password, new_password });
          status.className = 'form-status ok'; status.textContent = 'Password updated.'; f.reset();
        } catch (err) { status.className = 'form-status err'; status.textContent = err.message; }
        finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Update password'; }
      });
    }

    async function initDashboard() {
      try {
        const me = await window.doxtox.api.get('/auth/me');
        currentUser = me.user;
      } catch (e) { window.location.replace('/admin'); return; }
      $('#userEmail').textContent = currentUser.email || '';
      $('#logoutBtn').addEventListener('click', async () => {
        try { await window.doxtox.api.post('/auth/logout', {}); } catch (x) {}
        window.location.replace('/admin');
      });
      try {
        const res = await window.doxtox.api.get('/admin/content');
        content = res && res.content ? deepMerge(window.DOXTOX_DEFAULT_CONTENT, res.content) : window.DOXTOX_DEFAULT_CONTENT;
      } catch (e) { toast('Could not load content: ' + e.message, 'err'); content = window.DOXTOX_DEFAULT_CONTENT; }
      LIST_DEFS = buildListDefs(); hydrateForms();
      ['formHero', 'formFeatures', 'formAbout', 'formContact', 'formFooter'].forEach((id) => {
        const f = document.getElementById(id);
        f.addEventListener('submit', (e) => { e.preventDefault(); saveContent(f); });
      });
      $$('.add-row-btn').forEach((btn) => btn.addEventListener('click', () => {
        const def = LIST_DEFS[btn.dataset.add]; if (def) def.container.appendChild(makeListRow(def, def.blank));
      }));
      try { await loadProducts(); renderProducts(); } catch (e) { toast('Could not load products: ' + e.message, 'err'); }
      $('#addProductBtn').addEventListener('click', createProduct);
      $('#msgFilter').addEventListener('change', () => loadMessages().catch((e) => toast(e.message, 'err')));
      $('#msgReload').addEventListener('click', () => loadMessages().catch((e) => toast(e.message, 'err')));
      $('#overviewReload').addEventListener('click', refreshOverview);
      initAdmins();
      initPasswordForm(); initTabs(); refreshOverview();
    }

    /* ---------- login view ---------- */
    function showView(name) {
      $('#authWrap').classList.toggle('hidden', name === 'dash');
      $('#view-login').classList.toggle('hidden', name !== 'login');
      $('#view-setup').classList.toggle('hidden', name !== 'setup');
      $('#view-dash').classList.toggle('hidden', name !== 'dash');
    }
    function initLogin() {
      // already signed in?
      window.doxtox.api.get('/auth/me').then(() => { showView('dash'); initDashboard(); }).catch(() => showView('login'));

      $('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errBox = $('#loginError'); errBox.classList.remove('show');
        const btn = $('#loginBtn');
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in…';
        try {
          await window.doxtox.api.post('/auth/login', {
            email: $('#loginEmail').value.trim(), password: $('#loginPassword').value
          });
          showView('dash'); initDashboard();
        } catch (err) {
          errBox.textContent = err.message || 'Login failed.'; errBox.classList.add('show');
          btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign in';
        }
      });
      $('#goSetup').addEventListener('click', (e) => { e.preventDefault(); showView('setup'); });
      $('#backLogin').addEventListener('click', (e) => { e.preventDefault(); showView('login'); });

      $('#setupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errBox = $('#setupError'), okBox = $('#setupOk');
        errBox.classList.remove('show'); errBox.textContent = ''; okBox.classList.remove('show');
        const btn = $('#setupBtn');
        const password = $('#setupPassword').value;
        if (password.length < 10) { errBox.textContent = 'Password must be at least 10 characters.'; errBox.classList.add('show'); return; }
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating…';
        try {
          await window.doxtox.api.post('/auth/setup', {
            setup_key: $('#setupKey').value, email: $('#setupEmail').value.trim(), password
          });
          okBox.classList.add('show'); $('#setupForm').style.display = 'none';
          setTimeout(() => { showView('login'); }, 1500);
        } catch (err) {
          errBox.textContent = err.status === 404 ? 'Setup is disabled — no SETUP_SECRET configured.' :
            err.status === 403 ? 'Incorrect setup secret.' : (err.message || 'Setup failed.');
          errBox.classList.add('show');
          btn.disabled = false; btn.innerHTML = '<i class="fas fa-user-shield"></i> Create / reset admin';
        }
      });
    }
    function init() {
      if ($('#loginForm')) initLogin();
      else if ($('#sideNav')) initDashboard();
    }
    return { init };
  })();

  /* ----------------------------------------------------------------------
     LEGACY REDIRECT (?verify= / ?page= → ems.html)
  ---------------------------------------------------------------------- */
  (function () {
    if (window.DOXTOX_DISABLE_EMS_REDIRECT) return;
    const q = window.location.search;
    if (/[?&](verify|page)=/.test(q)) window.location.replace('ems.html' + q + window.location.hash);
  })();

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.classList.contains('landing')) Landing.init();
    if (document.body.classList.contains('admin')) Admin.init();
  });
})();
