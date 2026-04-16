import { v4 as uuid } from 'uuid';
import { run, prepare } from './index.js';

export function seedDefaultRoles() {
  const existingRoles = prepare('SELECT id FROM roles WHERE is_system = 1').all();
  if (existingRoles.length > 0) return;
  
  const systemRoles = [
    { name: 'super_admin', permissions: ['*'] },
    { name: 'property_manager', permissions: ['orgs.*', 'buildings.*', 'units.*', 'tenants.*', 'flat_owners.*', 'payments.*', 'expenses.*', 'invoices.*', 'roles.*', 'members.*'] },
    { name: 'member', permissions: ['*.read'] },
  ];
  
  for (const role of systemRoles) {
    const roleId = uuid();
    run('INSERT INTO roles (id, name, is_system) VALUES (?, ?, 1)', [roleId, role.name]);
    for (const perm of role.permissions) {
      run('INSERT INTO role_permissions (id, role_id, permission) VALUES (?, ?, ?)', [uuid(), roleId, perm]);
    }
  }
  console.log('Default roles seeded');
}