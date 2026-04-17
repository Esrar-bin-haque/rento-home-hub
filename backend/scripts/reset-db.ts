import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, saveDatabase, run, exec, prepare } from '../src/db/index.js';
import { runMigrations } from '../src/db/migrate.js';
import { seedDefaultRoles } from '../src/db/seed.js';
import { seedSuperAdmin } from '../src/db/seed-admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data/rento.db');

async function resetDb() {
  console.log('=== Resetting Database (Clean - Super Admin Only) ===\n');
  
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Deleted existing database:', dbPath);
  }

  console.log('Initializing database...');
  await initDatabase();

  console.log('Running migrations...');
  await runMigrations();

  console.log('Seeding default roles...');
  seedDefaultRoles();

  console.log('Creating super admin...');
  seedSuperAdmin();

  saveDatabase();
  console.log('\n=== Database reset complete! ===');
  console.log('Super Admin credentials:');
  console.log('  Phone: 01700000000');
  console.log('  Password: superadmin');
}

resetDb().catch(console.error);