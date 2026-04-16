# Rento Backend Specsheet

> Status: IN PROGRESS — written iteratively. Each section is committed as completed.
> Stack: Express + TypeScript + better-sqlite3 + Passport.js + JWT (httpOnly cookies)
> Architecture: SaaS multi-tenant, monorepo, Vite dev proxy

---

## 1. Project Structure

```
rento-home-hub/
├── src/                          # React frontend (unchanged)
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts          # better-sqlite3 singleton
│   │   │   ├── migrations/       # 001_init.sql, 002_*.sql, ...
│   │   │   └── seed.ts           # dev seed data
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT verify → req.user
│   │   │   ├── rbac.ts           # requirePermission('resource.action')
│   │   │   └── orgScope.ts       # enforce org isolation on every query
│   │   ├── routes/
│   │   │   ├── auth.ts           # /api/auth/*
│   │   │   ├── orgs.ts           # /api/orgs/*
│   │   │   ├── buildings.ts      # /api/buildings/*
│   │   │   ├── units.ts          # /api/units/*
│   │   │   ├── tenants.ts        # /api/tenants/*
│   │   │   ├── payments.ts       # /api/payments/*
│   │   │   ├── expenses.ts       # /api/expenses/*
│   │   │   ├── invoices.ts       # /api/invoices/*
│   │   │   ├── roles.ts          # /api/roles/*
│   │   │   └── admin.ts          # /api/admin/* (super_admin only)
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── invoice.service.ts
│   │   │   └── rbac.service.ts
│   │   └── index.ts              # Express entry point, port 3001
│   ├── package.json
│   └── tsconfig.json
├── vite.config.ts                # proxy /api → http://localhost:3001
└── package.json                  # root: concurrently runs both
```

**Root package.json scripts:**
```json
{
  "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
  "dev:backend": "cd backend && npm run dev",
  "dev:frontend": "vite"
}
```

**Vite proxy (vite.config.ts addition):**
```ts
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

---

## 2. Database Schema

SQLite via `better-sqlite3`. Migrations are numbered SQL files run in order on startup.

### 2.1 Core Tables

#### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID v4 |
| email | TEXT UNIQUE | nullable if phone-only |
| phone | TEXT UNIQUE | nullable if google-only |
| password_hash | TEXT | nullable for Google-only users |
| google_id | TEXT UNIQUE | nullable for phone/password users |
| name | TEXT | |
| avatar_url | TEXT | from Google profile |
| is_super_admin | INTEGER | 0/1, default 0 |
| is_verified | INTEGER | 0/1, default 0 |
| created_at | TEXT | ISO datetime |
| updated_at | TEXT | ISO datetime |

#### `organizations`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID v4 |
| name | TEXT | e.g. "Sunset Tower HOA" |
| slug | TEXT UNIQUE | URL-safe identifier |
| owner_id | TEXT FK→users | creator/primary owner |
| plan | TEXT | 'free' \| 'pro' (for future billing) |
| is_active | INTEGER | 0/1, default 1 |
| created_at | TEXT | |

#### `org_members`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | |
| user_id | TEXT FK→users | |
| role_id | TEXT FK→roles | |
| invited_by | TEXT FK→users | nullable |
| joined_at | TEXT | |
| UNIQUE | (org_id, user_id) | one membership per org |

#### `roles`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | NULL for system-default roles |
| name | TEXT | e.g. 'building_manager', 'cashier' |
| is_system | INTEGER | 0/1 — system roles cannot be deleted |
| created_at | TEXT | |

#### `role_permissions`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| role_id | TEXT FK→roles | |
| permission | TEXT | e.g. 'payments.write', 'tenants.read' |
| UNIQUE | (role_id, permission) | |

### 2.2 Property Tables

#### `buildings`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | |
| name | TEXT | |
| address | TEXT | |
| total_floors | INTEGER | |
| created_at | TEXT | |

#### `units`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| building_id | TEXT FK→buildings | |
| org_id | TEXT FK→organizations | denormalized for query perf |
| unit_number | TEXT | e.g. "A1", "B2" |
| floor | TEXT | |
| size_sqft | INTEGER | |
| rent_amount | INTEGER | in BDT |
| service_charge | INTEGER | in BDT |
| status | TEXT | 'occupied' \| 'vacant' |
| created_at | TEXT | |

#### `flat_owners`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | |
| unit_id | TEXT FK→units | |
| user_id | TEXT FK→users | nullable — owner may not have app account |
| name | TEXT | |
| phone | TEXT | |
| nid | TEXT | National ID |
| since | TEXT | move-in / ownership date |
| status | TEXT | 'active' \| 'inactive' |

#### `tenants`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | |
| unit_id | TEXT FK→units | |
| user_id | TEXT FK→users | nullable |
| name | TEXT | |
| phone | TEXT | |
| nid | TEXT | |
| move_in_date | TEXT | |
| advance_amount | INTEGER | BDT |
| status | TEXT | 'active' \| 'inactive' |
| created_at | TEXT | |

### 2.3 Financial Tables

#### `payments`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | |
| tenant_id | TEXT FK→tenants | |
| unit_id | TEXT FK→units | |
| amount | INTEGER | BDT |
| type | TEXT | 'rent' \| 'service_charge' \| 'advance' \| 'utility' |
| month | TEXT | 'YYYY-MM' |
| method | TEXT | 'bkash' \| 'nagad' \| 'cash' \| 'bank_transfer' |
| status | TEXT | 'paid' \| 'due' \| 'overdue' |
| paid_at | TEXT | nullable |
| recorded_by | TEXT FK→users | |
| notes | TEXT | |
| created_at | TEXT | |

#### `expenses`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | |
| building_id | TEXT FK→buildings | nullable |
| description | TEXT | |
| amount | INTEGER | BDT |
| category | TEXT | 'maintenance' \| 'repair' \| 'cleaning' \| 'salary' \| 'utilities' \| 'other' |
| date | TEXT | |
| added_by | TEXT FK→users | |
| created_at | TEXT | |

#### `account_payables`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | |
| description | TEXT | |
| amount | INTEGER | BDT |
| pay_to | TEXT | vendor/person name |
| due_date | TEXT | |
| status | TEXT | 'pending' \| 'paid' |
| paid_at | TEXT | nullable |
| created_at | TEXT | |

#### `invoices`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| org_id | TEXT FK→organizations | |
| invoice_number | TEXT UNIQUE | auto-generated: INV-{YYYY}-{seq} |
| tenant_id | TEXT FK→tenants | |
| unit_id | TEXT FK→units | |
| month | TEXT | 'YYYY-MM' |
| line_items | TEXT | JSON array of {label, amount} |
| total_amount | INTEGER | BDT |
| status | TEXT | 'draft' \| 'issued' \| 'paid' |
| issued_at | TEXT | |
| due_date | TEXT | |
| paid_at | TEXT | nullable |
| created_by | TEXT FK→users | |
| created_at | TEXT | |

### 2.4 Auth Tables

#### `refresh_tokens`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| user_id | TEXT FK→users | |
| token_hash | TEXT | SHA-256 of actual token |
| expires_at | TEXT | |
| created_at | TEXT | |

#### `account_links`
Tracks when a Google account is linked to an existing phone/password account.
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| user_id | TEXT FK→users | |
| provider | TEXT | 'google' |
| provider_id | TEXT | Google sub |
| linked_at | TEXT | |

---

## 3. Authentication

### 3.1 Strategy

- **Primary**: Google OAuth 2.0 via `passport-google-oauth20`
- **Fallback**: Phone + password via `passport-local` (bcrypt, cost 12)
- **Sessions**: JWT access token (15min) + refresh token (30d) in httpOnly cookies
- **Account linking**: User can link Google to existing phone/password account from settings

### 3.2 Auth Flow

#### Google OAuth
```
1. Frontend: GET /api/auth/google
2. Google redirects to /api/auth/google/callback
3. On success:
   a. If google_id exists → find user, issue tokens
   b. If email matches existing user → link accounts, issue tokens
   c. New user → create user + issue tokens
4. Redirect to frontend with tokens set in httpOnly cookies
```

#### Phone + Password
```
POST /api/auth/login
{ phone, password }
→ verify password hash
→ issue JWT access + refresh tokens
```

#### Token Refresh
```
POST /api/auth/refresh
(reads refresh token from httpOnly cookie)
→ validates token_hash in DB
→ issues new access token
```

### 3.3 JWT Payload
```ts
{
  sub: userId,
  email?: string,
  phone?: string,
  is_super_admin: boolean,
  iat: number,
  exp: number
}
```
Org membership and permissions are NOT embedded in JWT — fetched fresh per request via `orgScope` middleware to avoid stale permission bugs.

### 3.4 Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/auth/google | Initiate Google OAuth |
| GET | /api/auth/google/callback | OAuth callback |
| POST | /api/auth/login | Phone + password login |
| POST | /api/auth/register | Phone + password registration |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Clear cookies, invalidate refresh token |
| GET | /api/auth/me | Current user info + org memberships |
| POST | /api/auth/link-google | Link Google to existing account |

---

## 4. RBAC (Role-Based Access Control)

### 4.1 System Default Roles

Seeded on first run. `is_system = 1`, cannot be deleted.

| Role | Default Permissions |
|------|-------------------|
| `super_admin` | `*` (all permissions, bypasses all checks) |
| `property_manager` | All permissions within their org |
| `building_manager` | All permissions scoped to their building |
| `cashier` | `payments.read`, `payments.write`, `expenses.read`, `expenses.write`, `invoices.read`, `invoices.write`, `tenants.read` |
| `member` | `*.read` (all read permissions) |
| `owner` | `units.read`, `tenants.read`, `payments.read`, `invoices.read` (own unit only) |
| `tenant` | `payments.read` (own), `invoices.read` (own) |

### 4.2 Permission Naming

Format: `resource.action`

Resources: `orgs`, `buildings`, `units`, `tenants`, `flat_owners`, `payments`, `expenses`, `invoices`, `roles`, `members`

Actions: `read`, `write`, `delete`

Special: `*` wildcard for super_admin.

### 4.3 Custom Roles

Org admins can create custom roles with any combination of permissions:
```
POST /api/roles        { name, permissions: string[] }
PUT  /api/roles/:id    { name?, permissions? }
DELETE /api/roles/:id  (cannot delete is_system roles)
```

### 4.4 Middleware Usage

```ts
// Example route protection:
router.post('/payments',
  requireAuth,                           // valid JWT
  requireOrgMember,                      // user belongs to org
  requirePermission('payments.write'),   // has permission
  handler
);
```

`requirePermission` checks:
1. Is user `super_admin`? → allow
2. Get user's role in current org
3. Load role permissions from DB
4. Check if permission string matches (exact or wildcard)

---

## 5. API Endpoints

### 5.1 Organizations

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| POST | /api/orgs | authenticated | Create org (self-service) |
| GET | /api/orgs/mine | authenticated | List user's orgs |
| GET | /api/orgs/:id | orgs.read | Get org details |
| PUT | /api/orgs/:id | orgs.write | Update org |
| DELETE | /api/orgs/:id | orgs.delete | Deactivate org |
| POST | /api/orgs/:id/invite | members.write | Invite member by email/phone |
| GET | /api/orgs/:id/members | members.read | List members + roles |
| PUT | /api/orgs/:id/members/:userId | members.write | Change member role |
| DELETE | /api/orgs/:id/members/:userId | members.delete | Remove member |

### 5.2 Buildings

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/buildings | buildings.read | List org buildings |
| POST | /api/buildings | buildings.write | Create building |
| GET | /api/buildings/:id | buildings.read | Get building |
| PUT | /api/buildings/:id | buildings.write | Update building |
| DELETE | /api/buildings/:id | buildings.delete | Delete building |

### 5.3 Units

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/units | units.read | List units (filter by building) |
| POST | /api/units | units.write | Create unit |
| GET | /api/units/:id | units.read | Get unit |
| PUT | /api/units/:id | units.write | Update unit |
| DELETE | /api/units/:id | units.delete | Delete unit |

### 5.4 Tenants

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/tenants | tenants.read | List tenants |
| POST | /api/tenants | tenants.write | Add tenant to unit |
| GET | /api/tenants/:id | tenants.read | Get tenant + payment history |
| PUT | /api/tenants/:id | tenants.write | Update tenant |
| DELETE | /api/tenants/:id | tenants.delete | Mark tenant inactive |

### 5.5 Flat Owners

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/flat-owners | flat_owners.read | List flat owners |
| POST | /api/flat-owners | flat_owners.write | Add flat owner |
| GET | /api/flat-owners/:id | flat_owners.read | Get flat owner |
| PUT | /api/flat-owners/:id | flat_owners.write | Update flat owner |
| DELETE | /api/flat-owners/:id | flat_owners.delete | Remove flat owner |

### 5.6 Payments

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/payments | payments.read | List payments (filter: month, status, unit) |
| POST | /api/payments | payments.write | Record payment |
| GET | /api/payments/:id | payments.read | Get payment |
| PUT | /api/payments/:id/mark-paid | payments.write | Mark payment as paid |
| DELETE | /api/payments/:id | payments.delete | Delete payment record |

### 5.7 Expenses

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/expenses | expenses.read | List expenses (filter: month, category) |
| POST | /api/expenses | expenses.write | Add expense |
| GET | /api/expenses/:id | expenses.read | Get expense |
| PUT | /api/expenses/:id | expenses.write | Update expense |
| DELETE | /api/expenses/:id | expenses.delete | Delete expense |

### 5.8 Account Payables

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/account-payables | payments.read | List payables |
| POST | /api/account-payables | payments.write | Add payable |
| PUT | /api/account-payables/:id/mark-paid | payments.write | Mark as paid |
| DELETE | /api/account-payables/:id | payments.delete | Delete |

### 5.9 Invoices

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/invoices | invoices.read | List invoices |
| POST | /api/invoices | invoices.write | Generate invoice |
| GET | /api/invoices/:id | invoices.read | Get invoice data |
| GET | /api/invoices/:id/print | invoices.read | HTML printable invoice page |
| PUT | /api/invoices/:id/mark-paid | invoices.write | Mark invoice as paid |
| DELETE | /api/invoices/:id | invoices.delete | Delete invoice |

### 5.10 Roles (Custom RBAC)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/roles | roles.read | List roles for org |
| POST | /api/roles | roles.write | Create custom role |
| PUT | /api/roles/:id | roles.write | Update role permissions |
| DELETE | /api/roles/:id | roles.delete | Delete custom role |

### 5.11 Admin (Super Admin Only)

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/admin/orgs | List all organizations |
| GET | /api/admin/orgs/:id | Get any org detail |
| PUT | /api/admin/orgs/:id | Edit any org |
| DELETE | /api/admin/orgs/:id | Deactivate any org |
| GET | /api/admin/users | List all users |
| GET | /api/admin/users/:id | Get any user |
| PUT | /api/admin/users/:id | Edit any user |
| DELETE | /api/admin/users/:id | Deactivate any user |
| GET | /api/admin/stats | Platform-wide stats |

### 5.12 Dashboard / Reports

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | /api/dashboard | buildings.read | Aggregated dashboard data |
| GET | /api/reports/monthly | payments.read | Monthly income/expense summary |
| GET | /api/reports/payment-status | payments.read | Per-unit payment status for month |

---

## 6. Invoice System

### 6.1 Invoice Number Format
`INV-{YYYY}-{zero-padded-seq}` e.g. `INV-2026-00042`
Sequence is per-org, incremented atomically.

### 6.2 Line Items (JSON stored in `invoices.line_items`)
```json
[
  { "label": "Rent — April 2026", "amount": 20000 },
  { "label": "Service Charge", "amount": 3000 },
  { "label": "Advance Adjustment", "amount": -2000 }
]
```

### 6.3 Printable HTML Invoice
`GET /api/invoices/:id/print` — serves a standalone HTML page:
- Org name, address
- Invoice number, issue date, due date
- Tenant name, unit number, building
- Line items table
- Total in BDT
- Payment status badge
- Payment method (if paid)
- Authorized signature line
- Print button via `window.print()`
- CSS `@media print` hides navigation

### 6.4 Bulk Invoice Generation
`POST /api/invoices/bulk` — generates invoices for all active tenants in an org for a given month. Skips tenants who already have an invoice for that month.

---

## 7. Multi-Tenancy & Org Scoping

Every request to a protected resource must include the org context. Two mechanisms:

**Header**: `X-Org-Id: <org_id>` (set by frontend on every API call)

`orgScope` middleware:
1. Reads `X-Org-Id` header
2. Verifies `req.user` is a member of that org (or is super_admin)
3. Attaches `req.org` and `req.orgMember` to request
4. All DB queries in route handlers filter by `org_id` from `req.org.id`

Super admin bypasses org membership check but still scopes queries when `X-Org-Id` is provided.

---

## 8. Frontend Integration Plan

### 8.1 Changes to AuthContext
Replace mock `login`/`register` with real API calls:
```ts
login(phone, password) → POST /api/auth/login
register(name, phone, role, password) → POST /api/auth/register
googleLogin() → redirect to GET /api/auth/google
logout() → POST /api/auth/logout
```
Add `currentOrg` state — store selected org ID in localStorage, send as `X-Org-Id` on all requests.

### 8.2 API Client
Create `src/lib/api.ts` — thin wrapper around `fetch`:
- Auto-attaches `X-Org-Id` header
- Handles 401 → trigger token refresh → retry
- Handles 403 → show permission denied toast

### 8.3 Page-by-Page Dynamic Data

| Page | Replaces mock data with |
|------|------------------------|
| BuildingManagement | buildings, units, flat_owners, tenants, payments, expenses APIs |
| PropertyManagement | same APIs, scoped to multi-property view |
| Rentals | units with status='vacant' + public listings endpoint |
| Services | static for now (no backend needed) |
| Login | real auth endpoints + Google OAuth button |
| Register | real register endpoint |

### 8.4 Admin Panel
New route `/admin` (super_admin only):
- Sidebar: Organizations, Users, Stats
- Lists all orgs with active/inactive toggle
- Lists all users with deactivate option
- Platform stats: total orgs, total users, total payments recorded

---

## 9. Security

- All cookies: `httpOnly: true`, `sameSite: 'lax'`, `secure: true` in production
- Passwords: bcrypt cost 12
- JWT secret: environment variable `JWT_SECRET`, min 32 chars
- Google credentials: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` env vars
- Rate limiting: `express-rate-limit` on auth endpoints (10 req/15min)
- Input validation: `zod` schemas on all POST/PUT request bodies
- CORS: restricted to frontend origin in production
- SQL injection: not possible — `better-sqlite3` uses parameterized statements exclusively
- Org isolation: every query includes `WHERE org_id = ?` enforced by `orgScope` middleware

---

## 10. Dependencies

### Backend (`backend/package.json`)

```json
{
  "dependencies": {
    "express": "^4.19",
    "better-sqlite3": "^9.4",
    "passport": "^0.7",
    "passport-google-oauth20": "^2.0",
    "passport-local": "^1.0",
    "bcryptjs": "^2.4",
    "jsonwebtoken": "^9.0",
    "zod": "^3.22",
    "express-rate-limit": "^7.0",
    "cors": "^2.8",
    "cookie-parser": "^1.4",
    "uuid": "^9.0",
    "dotenv": "^16.0"
  },
  "devDependencies": {
    "typescript": "^5.4",
    "@types/express": "^4.17",
    "@types/better-sqlite3": "^7.6",
    "@types/passport": "^1.0",
    "@types/passport-google-oauth20": "^2.0",
    "@types/passport-local": "^1.0",
    "@types/bcryptjs": "^2.4",
    "@types/jsonwebtoken": "^9.0",
    "@types/cors": "^2.8",
    "@types/cookie-parser": "^1.4",
    "@types/uuid": "^9.0",
    "tsx": "^4.7",
    "nodemon": "^3.1"
  }
}
```

### Root additions (`package.json`)
```json
"concurrently": "^8.2"
```

---

## 11. Environment Variables

```env
# backend/.env
PORT=3001
JWT_SECRET=<min-32-char-random-string>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
FRONTEND_URL=http://localhost:8080
DB_PATH=./data/rento.db
NODE_ENV=development
```

---

## 12. Implementation Order

Phase 1 — Auth foundation (this is the starting point):
1. `backend/` folder, `package.json`, `tsconfig.json`
2. DB connection + migration runner + `001_init.sql` (users, refresh_tokens, account_links)
3. Passport local strategy + `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
4. JWT middleware (`auth.ts`)
5. Passport Google OAuth strategy + `/api/auth/google`, `/api/auth/google/callback`, `/api/auth/link-google`
6. Token refresh endpoint
7. Replace `AuthContext` mock with real calls + add Google login button to Login page

Phase 2 — Org + RBAC:
8. `002_orgs.sql` migration (organizations, org_members, roles, role_permissions)
9. Org creation flow + `orgScope` middleware
10. RBAC middleware + seed default roles/permissions
11. Org invite + member management endpoints
12. Custom role CRUD

Phase 3 — Core data (Building Management):
13. `003_properties.sql` migration (buildings, units, flat_owners, tenants)
14. Buildings + Units CRUD
15. Flat Owners + Tenants CRUD
16. Replace BuildingManagement mock data with API calls

Phase 4 — Financial:
17. `004_financial.sql` migration (payments, expenses, account_payables, invoices)
18. Payments + mark-paid endpoints
19. Expenses + account payables CRUD
20. Invoice generation + printable HTML endpoint
21. Bulk invoice generation
22. Replace PropertyManagement mock data with API calls

Phase 5 — Dashboard + Admin:
23. Dashboard aggregation endpoint
24. Monthly reports endpoint
25. Admin panel routes + frontend `/admin` page
26. Super admin org/user management

---

*Spec complete. Last updated: 2026-04-14*
