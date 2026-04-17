import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export async function createTestDb(): Promise<Database> {
  const SQL = await initSqlJs();
  db = new SQL.Database();
  db.run('PRAGMA foreign_keys = ON');
  await runMigrations(db);
  return db;
}

async function runMigrations(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE,
      applied_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password_hash TEXT,
    google_id TEXT UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    is_super_admin INTEGER NOT NULL DEFAULT 0,
    is_verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS account_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    linked_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    org_id TEXT,
    name TEXT NOT NULL,
    is_system INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS role_permissions (
    id TEXT PRIMARY KEY,
    role_id TEXT NOT NULL,
    permission TEXT NOT NULL,
    UNIQUE(role_id, permission)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS org_members (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    invited_by TEXT,
    joined_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(org_id, user_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS buildings (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    total_floors INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS units (
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS flat_owners (
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tenants (
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS payments (
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL,
    building_id TEXT,
    description TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    added_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS account_payables (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL,
    description TEXT NOT NULL,
    amount INTEGER NOT NULL,
    pay_to TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    paid_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS invoices (
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS invoice_sequences (
    org_id TEXT PRIMARY KEY,
    current_year TEXT NOT NULL,
    current_seq INTEGER NOT NULL DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS invoice_sequences (
    org_id TEXT PRIMARY KEY,
    current_year TEXT NOT NULL,
    current_seq INTEGER NOT NULL DEFAULT 0
  )`);
}

export function closeTestDb() {
  if (db) {
    db.close();
    db = null;
  }
}

export function getTestDb(): Database {
  if (!db) {
    throw new Error('No test database created');
  }
  return db;
}