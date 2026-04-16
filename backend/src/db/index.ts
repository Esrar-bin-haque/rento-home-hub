import initSqlJs, { Database as SqlJsDatabase, SqlValue } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';

const dbPath = config.dbPath;
const dbDir = path.dirname(path.resolve(dbPath));

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: SqlJsDatabase;

export async function initDatabase() {
  const SQL = await initSqlJs();
  
  let data: Uint8Array | undefined;
  if (fs.existsSync(dbPath)) {
    data = new Uint8Array(fs.readFileSync(dbPath));
  }
  
  db = new SQL.Database(data);
  
  db.run('PRAGMA foreign_keys = ON');
  
  return db;
}

export function getDb(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export function run(sql: string, params?: SqlValue[]) {
  return getDb().run(sql, params);
}

export function exec(sql: string) {
  return getDb().exec(sql);
}

export function prepare(sql: string) {
  return {
    all: (params?: SqlValue[]) => {
      const stmt = getDb().prepare(sql);
      if (params) stmt.bind(params);
      const results: Record<string, SqlValue>[] = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    },
    run: (params?: SqlValue[]) => {
      const stmt = getDb().prepare(sql);
      if (params) stmt.bind(params);
      stmt.step();
      stmt.free();
    }
  };
}

export function transaction(fn: () => void) {
  getDb().exec('BEGIN TRANSACTION');
  try {
    fn();
    getDb().exec('COMMIT');
  } catch (err) {
    getDb().exec('ROLLBACK');
    throw err;
  }
}

export default { initDatabase, getDb, saveDatabase, run, exec, prepare };