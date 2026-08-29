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
  active        INTEGER NOT NULL DEFAULT 1,
  last_login    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
-- NOTE: databases created before the admin-management feature get the
-- `active` and `last_login` columns added automatically by the API on the
-- first request (no manual SQL needed).

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

-- ---------- SEED: start EMPTY ----------
-- The site ships blank on purpose: there is no hardcoded content to flash or
-- override. After deploying, open /admin.html and use the “Load demo content”
-- button to fill every field with sample data (then edit and Save), or just
-- type your own content straight into the forms.
INSERT OR IGNORE INTO site_content (id, content) VALUES (1, '{}');
