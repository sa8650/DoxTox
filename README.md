# DoxTox

Company landing page for **DoxTox Technologies Ltd.** with a custom‑auth admin
dashboard — built entirely on **Cloudflare**: Pages (hosting), Pages Functions
(serverless API), and **D1** (SQLite database). No Supabase, no third‑party auth.

## Project structure

```
doxtox/
├── index.html                    # Public landing page
├── admin.html                    # Admin: login + first-time setup + dashboard (one page)
├── assets/
│   ├── app.css                   # All styles (landing + admin)
│   └── app.js                    # All client JS (API client, landing, admin)
├── functions/
│   └── api/
│       └── dox/
│           └── [[path]].js       # Single catch-all API router mounted at /api/dox/*
├── migrations/
│   └── 0001_init.sql             # D1 schema + seed content
├── package.json
├── wrangler.toml                 # No IDs/secrets here (bind in the dashboard)
├── _headers
├── _redirects
├── robots.txt
└── sitemap.xml
```

This mirrors the InfluencerOS layout: one `app.css`/`app.js`, a single
`functions/api/dox/[[path]].js` catch‑all router, and flat root files.

## Required services

- Cloudflare Pages
- Cloudflare D1 database (named **`doxtox`**, bound as **`DB`**)

## Environment variables & secrets

Set these in **Cloudflare Pages → Settings → Variables and Secrets** (nothing
sensitive is committed to Git):

```
SETUP_SECRET = a-long-random-string-you-choose   (type: Secret)
```

Then bind the database in **Pages → Settings → Functions → D1 database bindings**:

```
Variable name: DB   →   D1 database: doxtox
```

For local development put secrets in `.dev.vars` (git‑ignored):
```
SETUP_SECRET = "local-test-key"
```

## Setup — browser only (no local tools required)

1. **Upload the files** to a GitHub repo (Add file → Upload files).
2. **Create the D1 database:** Cloudflare → Storage & Databases → D1 → Create,
   name it **`doxtox`**. Open it → **Console** tab → paste
   `migrations/0001_init.sql` → Execute (creates tables + seeds the site).
3. **Create the Pages project:** Workers & Pages → Create → Pages → Connect to
   Git → pick the repo → framework preset **None**, build command **empty**,
   output directory **`/`** (root) → Deploy.
4. **Add settings** on the Pages project:
   - Variables and Secrets → add **`SETUP_SECRET`** (Secret).
   - Functions → D1 database bindings → add **`DB`** → database **`doxtox`**.
5. **Create your admin login:** open
   `https://<your-site>/admin.html` → **First‑time setup** → enter the
   `SETUP_SECRET`, your email and a strong password (min 10 chars). The same
   setup screen also resets a forgotten password.

Day‑to‑day: edit content/products/messages inside `/admin.html` (saved
instantly to D1), or edit code directly on GitHub (Cloudflare auto‑redeploys).

## API (mounted at `/api/dox/*`)

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/content` | public | Editable page content |
| GET | `/products` | public | Active products |
| POST | `/messages` | public | Contact form `{name,email,company,message}` (honeypot + rate limit) |
| POST | `/auth/login` | public | Login `{email,password}` (sets HttpOnly cookie) |
| POST | `/auth/setup` | public | Create/reset admin (requires `SETUP_SECRET`) |
| POST | `/auth/logout` | public | Clear session |
| GET | `/auth/me` | session | Current admin |
| GET/PUT | `/admin/content` | session | Read/save content |
| GET/POST/PUT/DELETE | `/admin/products` | session | Product CRUD |
| GET/PUT/DELETE | `/admin/messages` | session | Contact inbox |
| POST | `/admin/password` | session | Change own password |
| GET | `/admin/stats` | session | Overview counters |

## Auth & security

- Passwords: **PBKDF2‑SHA256, 210,000 iterations** + per‑user salt (Web Crypto).
- Sessions: random 256‑bit token stored in D1, sent as an
  **HttpOnly / Secure / SameSite=Lax** cookie.
- Every `/admin/*` API call requires a valid session; the admin page is
  `noindex` and excluded in `robots.txt`.
- Rate limiting on login (8/15 min), setup (10/15 min) and contact (5/10 min);
  contact form has a bot honeypot.
- `_headers` sets a strict CSP (same‑origin scripts; Font Awesome from cdnjs),
  HSTS, anti‑clickjacking and referrer policies.

## Local development (optional)

```bash
npm install
echo 'SETUP_SECRET = "local-test-key"' > .dev.vars
npx wrangler d1 migrations apply doxtox --local
npm run dev          # http://localhost:8788  (or the printed port)
```

```bash
npm run deploy       # deploy via CLI (Git integration deploys automatically)
npm run check        # build/validate the Pages Functions
```
