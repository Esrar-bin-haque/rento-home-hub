CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  month TEXT NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'due',
  paid_at TEXT,
  recorded_by TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  building_id TEXT,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  added_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS account_payables (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  pay_to TEXT NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);