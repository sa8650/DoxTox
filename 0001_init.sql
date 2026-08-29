-- ============================================================
-- DoxTox — D1 (SQLite) initial schema + seed
-- Paste into Cloudflare Dashboard → D1 → database "doxtox" →
-- Console, and Execute. Safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS site_content (
  id         INTEGER PRIMARY KEY CHECK (id = 1),
  content    TEXT NOT NULL DEFAULT '{}',
  updated_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT 'fas fa-cube',
  tags        TEXT NOT NULL DEFAULT '[]',
  link        TEXT NOT NULL DEFAULT '#',
  link_label  TEXT NOT NULL DEFAULT 'Learn more',
  featured    INTEGER NOT NULL DEFAULT 0,
  external    INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  email       TEXT NOT NULL CHECK (email LIKE '%_@_%.__%'),
  company     TEXT,
  message     TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 5000),
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','archived')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_created ON contact_messages(created_at DESC);

CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token         TEXT PRIMARY KEY,
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at    INTEGER NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_exp ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS rate_limits (
  id         TEXT PRIMARY KEY,
  scope      TEXT NOT NULL,
  hits       INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_created ON rate_limits(created_at);

-- ---------- SEED: site content ----------
INSERT OR IGNORE INTO site_content (id, content) VALUES (1, json('{
  "brand": { "name": "DoxTox", "logo_icon": "fas fa-bolt" },
  "nav": { "products": "Products", "features": "Features", "about": "About", "contact": "Contact" },
  "hero": {
    "label": "🚀 Next-gen software",
    "title_1": "Build smarter.",
    "title_2_highlight": "Ship faster.",
    "subtitle": "DoxTox crafts cutting-edge digital products for startups and enterprises. From AI tools to scalable platforms — we bring your vision to life.",
    "primary_btn": "Explore products",
    "primary_icon": "fas fa-rocket",
    "secondary_btn": "Get in touch",
    "secondary_icon": "fas fa-arrow-right"
  },
  "stats": [
    { "value": "50+", "label": "Projects delivered" },
    { "value": "98%", "label": "Client satisfaction" },
    { "value": "24/7", "label": "Support & maintenance" }
  ],
  "badges": [
    { "icon": "fas fa-robot", "title": "AI-powered", "subtitle": "Intelligent automation" },
    { "icon": "fas fa-cloud-upload-alt", "title": "Cloud-native", "subtitle": "Scale on demand" }
  ],
  "code_block": [
    { "dot": "green",  "html": "<span class=\"keyword\">import</span> { DoxTox } <span class=\"keyword\">from</span> <span class=\"string\">''@dox/kit''</span>;" },
    { "dot": "purple", "html": "<span class=\"keyword\">const</span> <span class=\"variable\">app</span> = <span class=\"keyword\">new</span> <span class=\"function\">DoxTox</span>({" },
    { "dot": "cyan",   "html": "&nbsp;&nbsp;<span class=\"variable\">name</span>: <span class=\"string\">''Nova''</span>," },
    { "dot": "green",  "html": "&nbsp;&nbsp;<span class=\"variable\">scale</span>: <span class=\"string\">''enterprise''</span>," },
    { "dot": "purple", "html": "&nbsp;&nbsp;<span class=\"variable\">features</span>: [<span class=\"string\">''AI''</span>, <span class=\"string\">''real-time''</span>, <span class=\"string\">''analytics''</span>]" },
    { "dot": "cyan",   "html": "}); <span class=\"comment\">// ready to deploy 🚀</span>" }
  ],
  "products_section": {
    "label": "📦 Our products",
    "title": "Built for **performance** & **scale**",
    "subtitle": "Each product is engineered with modern stacks, clean APIs, and a developer-first experience."
  },
  "features_section": { "label": "⚡ Why DoxTox", "title": "Engineered for **excellence**" },
  "features": [
    { "icon": "fas fa-code", "title": "Clean code", "text": "Maintainable, tested, and documented codebases." },
    { "icon": "fas fa-cloud", "title": "Cloud-ready", "text": "AWS, GCP, Azure — we deploy anywhere." },
    { "icon": "fas fa-lock", "title": "Security first", "text": "Zero-trust, encryption, and regular audits." },
    { "icon": "fas fa-people-arrows", "title": "Team collaboration", "text": "Agile workflows with transparent communication." }
  ],
  "about": {
    "label": "👋 About us",
    "title_1": "We turn complex",
    "title_2_highlight": "ideas into reality",
    "paragraphs": ["DoxTox Technologies Ltd. is a team of senior engineers, architects, and product strategists. We partner with founders and enterprises to design, build, and scale software that drives real business impact."],
    "checks": ["50+ successful projects", "15+ tech stacks mastered", "100% client retention"],
    "cta": "Work with us",
    "cta_icon": "fas fa-handshake"
  },
  "contact": {
    "label": "📬 Let''s talk",
    "title": "Ready to build **something great?**",
    "info_title": "Get in touch",
    "info_text": "Whether you have a project in mind or just want to explore possibilities — we''d love to hear from you.",
    "email": "hello@doxtox.example",
    "phone": "+1 (800) 555-0000",
    "address": "Your city, Country",
    "socials": [
      { "icon": "fab fa-github", "url": "https://github.com/doxtox", "label": "GitHub" },
      { "icon": "fab fa-linkedin-in", "url": "https://linkedin.com/company/doxtox", "label": "LinkedIn" },
      { "icon": "fab fa-x-twitter", "url": "https://x.com/doxtox", "label": "X" },
      { "icon": "fab fa-youtube", "url": "https://youtube.com/@doxtox", "label": "YouTube" }
    ]
  },
  "footer": {
    "tagline": "Crafting the future of software.",
    "links": [
      { "label": "Privacy", "url": "#" },
      { "label": "Terms", "url": "#" },
      { "label": "Security", "url": "#" },
      { "label": "Contact", "url": "#contact" }
    ]
  }
}'));

-- ---------- SEED: products ----------
INSERT OR IGNORE INTO products (id, title, description, icon, tags, link, link_label, featured, external, sort_order) VALUES
  ('prod-zudo', 'Zudo AI',
   'Enterprise-grade AI assistant that automates workflows, generates insights, and integrates with your data stack.',
   'fas fa-brain', '["Python", "TensorFlow", "REST"]', '#', 'Learn more', 0, 0, 10),
  ('prod-ems', 'EMS',
   'Complete multi-store management system with unified inventory, centralized order tracking, and real-time analytics across all locations.',
   'fas fa-store-alt', '["React", "Node.js", "Multi-tenant"]', 'ems.html', 'Explore EMS', 1, 0, 20),
  ('prod-influenceros', 'InfluencerOS',
   'Partner & influencer management platform — allocate project targets, track acquired users, calculate commissions and run balance-safe partner payouts.',
   'fas fa-bullhorn', '["Partners", "Projects", "Payouts"]', 'influenceros/', 'Open InfluencerOS', 0, 0, 30);
