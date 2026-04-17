import { v4 as uuid } from 'uuid';
import { run, prepare } from './index.js';

export async function seedDemoData() {
  const existingOrgs = prepare('SELECT id FROM organizations').all();
  if (existingOrgs.length > 0) {
    console.log('Demo data already exists, skipping seed');
    return;
  }

  console.log('Seeding demo data...');

  // Create demo user first
  const userId = uuid();
  const passwordHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LbY1sj5q3qH.F0Qm2'; // "password"
  run('INSERT INTO users (id, name, phone, password_hash, is_verified) VALUES (?, ?, ?, ?, ?)', [
    userId, 'Demo User', '01700000001', passwordHash, 1
  ]);

  // Create demo organization
  const orgId = uuid();
  run('INSERT INTO organizations (id, name, slug, owner_id) VALUES (?, ?, ?, ?)', [
    orgId, 'Demo Property Management', 'demo-pm', userId
  ]);

  // Get property_manager role
  const roles = prepare('SELECT id FROM roles WHERE name = ?').all(['property_manager']) as any[];
  const roleId = roles[0]?.id;

  // Link user to organization as property_manager
  if (roleId) {
    run('INSERT INTO org_members (id, org_id, user_id, role_id) VALUES (?, ?, ?, ?)', [
      uuid(), orgId, userId, roleId
    ]);
  }

  console.log('Demo user created: phone=01700000001, password=password');

  // Create demo buildings
  const buildingId1 = uuid();
  const buildingId2 = uuid();
  const buildingId3 = uuid();

  run('INSERT INTO buildings (id, org_id, name, address, total_floors) VALUES (?, ?, ?, ?, ?)', [
    buildingId1, orgId, 'Sunset Tower', 'Road 5, Dhanmondi, Dhaka', 10
  ]);
  run('INSERT INTO buildings (id, org_id, name, address, total_floors) VALUES (?, ?, ?, ?, ?)', [
    buildingId2, orgId, 'Green Heights', 'Block C, Bashundhara, Dhaka', 8
  ]);
  run('INSERT INTO buildings (id, org_id, name, address, total_floors) VALUES (?, ?, ?, ?, ?)', [
    buildingId3, orgId, 'City View Apt', 'Gulshan 2, Dhaka', 6
  ]);

  // Create demo units
  const unitIds: string[] = [];
  const units = [
    { b: buildingId1, n: 'A1', f: '1st', s: 850, r: 20000, st: 'occupied' },
    { b: buildingId1, n: 'A2', f: '1st', s: 900, r: 18000, st: 'occupied' },
    { b: buildingId1, n: 'B1', f: '2nd', s: 850, r: 22000, st: 'occupied' },
    { b: buildingId1, n: 'B2', f: '2nd', s: 950, r: 25000, st: 'occupied' },
    { b: buildingId1, n: 'C1', f: '3rd', s: 850, r: 20000, st: 'vacant' },
    { b: buildingId2, n: 'C2', f: '1st', s: 750, r: 15000, st: 'occupied' },
    { b: buildingId2, n: 'D1', f: '2nd', s: 1100, r: 30000, st: 'occupied' },
    { b: buildingId3, n: 'D2', f: '1st', s: 1200, r: 28000, st: 'occupied' },
  ];

  for (const u of units) {
    const unitId = uuid();
    unitIds.push(unitId);
    run('INSERT INTO units (id, building_id, org_id, unit_number, floor, size_sqft, rent_amount, service_charge, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      unitId, u.b, orgId, u.n, u.f, u.s, u.r, 2000, u.st
    ]);
  }

  // Create demo tenants
  const tenantIds: string[] = [];
  const tenants = [
    { u: unitIds[0], n: 'Rahim Uddin', p: '01711-000001', am: 40000 },
    { u: unitIds[1], n: 'Sumaiya Khan', p: '01722-000002', am: 36000 },
    { u: unitIds[2], n: 'Kamal Hossain', p: '01733-000003', am: 44000 },
    { u: unitIds[3], n: 'Nadia Islam', p: '01744-000004', am: 50000 },
    { u: unitIds[5], n: 'Fatema Begum', p: '01766-000006', am: 30000 },
    { u: unitIds[6], n: 'Shakil Ahmed', p: '01777-000007', am: 60000 },
    { u: unitIds[7], n: 'Riya Chowdhury', p: '01788-000008', am: 56000 },
  ];

  for (const t of tenants) {
    const tenantId = uuid();
    tenantIds.push(tenantId);
    run('INSERT INTO tenants (id, org_id, unit_id, name, phone, advance_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      tenantId, orgId, t.u, t.n, t.p, t.am, 'active'
    ]);
  }

  // Create demo payments for last 6 months
  const months = ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];
  const paymentTypes = ['rent', 'rent', 'rent', 'rent', 'rent', 'rent'];
  const methods = ['bank_transfer', 'bank_transfer', 'bKash', 'bank_transfer', 'bKash', 'bank_transfer'];

  for (let i = 0; i < tenantIds.length; i++) {
    const rentAmount = [20000, 18000, 22000, 25000, 15000, 30000, 28000][i];
    for (let j = 0; j < months.length; j++) {
      const isPaid = j < 5 || (i !== 2 && i !== 4);
      run('INSERT INTO payments (id, org_id, tenant_id, unit_id, amount, type, month, method, status, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        uuid(), orgId, tenantIds[i], units[i].b, rentAmount, paymentTypes[j], months[j], methods[j], isPaid ? 'paid' : 'due', 'system'
      ]);
    }
  }

  // Create demo expenses
  const expenses = [
    { d: '2026-03-05', desc: 'Generator maintenance', am: 8500, cat: 'Maintenance', b: buildingId1 },
    { d: '2026-03-03', desc: 'Lift repair', am: 15000, cat: 'Repair', b: buildingId2 },
    { d: '2026-02-28', desc: 'Common area cleaning', am: 3000, cat: 'Cleaning', b: buildingId1 },
    { d: '2026-02-25', desc: 'Security guard salary', am: 12000, cat: 'Salary', b: buildingId1 },
    { d: '2026-02-20', desc: 'Water pump repair', am: 5500, cat: 'Repair', b: buildingId2 },
    { d: '2026-02-15', desc: 'Electricity bill', am: 5500, cat: 'Utilities', b: buildingId1 },
  ];

  for (const e of expenses) {
    run('INSERT INTO expenses (id, org_id, building_id, description, amount, category, date, added_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      uuid(), orgId, e.b, e.desc, e.am, e.cat, e.d, 'system'
    ]);
  }

  // Create demo payables
  const payables = [
    { d: '2026-04-01', desc: 'Generator service contract', am: 25000, p: 'ABC Services' },
    { d: '2026-04-15', desc: 'Lift maintenance', am: 15000, p: 'LiftTech Co' },
    { d: '2026-04-10', desc: 'Security service', am: 20000, p: 'SecureForce' },
  ];

  for (const p of payables) {
    run('INSERT INTO account_payables (id, org_id, description, amount, pay_to, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      uuid(), orgId, p.desc, p.am, p.p, p.d, 'pending'
    ]);
  }

  console.log('Demo data seeded successfully!');
  console.log('  - Demo User: phone=01700000001, password=password');
  console.log('  - 3 Buildings, 8 Units, 7 Tenants');
  console.log('  - 42 Payments, 6 Expenses, 3 Payables');
}