CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  total_floors INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  building_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  floor TEXT,
  size_sqft INTEGER,
  rent_amount INTEGER,
  service_charge INTEGER,
  status TEXT NOT NULL DEFAULT 'vacant',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS flat_owners (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  nid TEXT,
  since TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  nid TEXT,
  move_in_date TEXT,
  advance_amount INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);