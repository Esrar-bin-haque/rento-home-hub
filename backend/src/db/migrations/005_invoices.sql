CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  tenant_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  month TEXT NOT NULL,
  line_items TEXT NOT NULL DEFAULT '[]',
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  issued_at TEXT,
  due_date TEXT,
  paid_at TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invoice_sequences (
  org_id TEXT PRIMARY KEY,
  current_year TEXT NOT NULL,
  current_seq INTEGER NOT NULL DEFAULT 0
);