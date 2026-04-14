import { exec, prepare, run } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

export async function runMigrations() {
  exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE,
      applied_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const applied = prepare('SELECT filename FROM migrations').all() as { filename: string }[];
  const appliedSet = new Set(applied.map(r => r.filename));

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    if (!appliedSet.has(file)) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      exec(sql);
      run('INSERT INTO migrations (filename) VALUES (?)', [file] as any);
      console.log(`Applied migration: ${file}`);
    }
  }
}