CREATE TABLE apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL DEFAULT 'ios' CHECK (platform = 'ios'),
  app_store_url TEXT NOT NULL DEFAULT '',
  support_email TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  has_in_app_purchases INTEGER NOT NULL DEFAULT 0,
  supported_languages TEXT NOT NULL DEFAULT '[]',
  icon_image_url TEXT NOT NULL DEFAULT '',
  screenshots TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX apps_name_idx ON apps(name);

CREATE TABLE policies (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  file_name TEXT NOT NULL,
  title TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(app_id, locale)
);

CREATE INDEX policies_app_id_idx ON policies(app_id);

CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  app_id TEXT REFERENCES apps(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('app-support', 'bug-report', 'general')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  email_status TEXT NOT NULL CHECK (email_status IN ('pending', 'sent', 'failed', 'not-configured')),
  created_at TEXT NOT NULL
);

CREATE INDEX contacts_created_at_idx ON contacts(created_at DESC);
