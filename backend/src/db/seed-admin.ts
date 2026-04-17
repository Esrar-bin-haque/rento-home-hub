import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { run, prepare } from './index.js';

export function seedSuperAdmin() {
  const existingAdmin = prepare('SELECT id FROM users WHERE phone = ?').all(['01700000000']) as any[];
  
  if (existingAdmin.length > 0) {
    console.log('Super admin already exists, skipping...');
    return;
  }

  const id = uuid();
  const passwordHash = bcrypt.hashSync('superadmin', 12);
  
  run(
    'INSERT INTO users (id, name, phone, password_hash, is_super_admin, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
    [id, 'Super Admin', '01700000000', passwordHash, 1, 1]
  );
  
  console.log('Super admin created: phone=01700000000, password=superadmin');
}