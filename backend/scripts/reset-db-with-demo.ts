import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, saveDatabase, run, prepare } from '../src/db/index.js';
import { runMigrations } from '../src/db/migrate.js';
import { seedDefaultRoles } from '../src/db/seed.js';
import { seedSuperAdmin } from '../src/db/seed-admin.js';
import { seedDemoData } from '../src/db/seed-demo.js';
import { v4 as uuid } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data/rento.db');

async function resetDbWithDemo() {
  console.log('=== Resetting Database (With Demo Data) ===\n');
  
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

  console.log('Seeding demo data...');
  await seedDemoData();

  saveDatabase();
  console.log('\n=== Database reset complete! ===');
  console.log('\nSuper Admin:');
  console.log('  Phone: 01700000000');
  console.log('  Password: superadmin');
  console.log('\nDemo User:');
  console.log('  Phone: 01700000001');
  console.log('  Password: password');
}

resetDbWithDemo().catch(console.error);