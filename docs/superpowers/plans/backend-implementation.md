# Rento Backend — Implementation Plan

> Derived from `backend_specsheet.md`. Each phase is a self-contained unit of work that can be assigned to a subagent. A phase is complete when all its steps pass and the next phase can begin without regressions.

---

## Phase 1 — Project Bootstrap & DB Foundation

**Goal:** Scaffold the `backend/` directory, install dependencies, get Express listening on port 3001, and have a working migration runner that creates the initial auth tables on startup.

### Step 1.1 — Create backend directory and package.json

- Create `backend/` at project root.
- Create `backend/package.json` with the dependencies listed in specsheet §10.
- Key production deps: `express`, `better-sqlite3`, `passport`, `passport-google-oauth20`, `passport-local`, `bcryptjs`, `jsonwebtoken`, `zod`, `express-rate-limit`, `cors`, `cookie-parser`, `uuid`, `dotenv`.
- Key dev deps: `typescript`, `tsx`, `nodemon`, and all `@types/*` packages.
- Scripts in `backend/package.json`:
  ```json
  {
    "dev": "nodemon --watch src --ext ts --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
  ```

### Step 1.2 — Create tsconfig.json

- Create `backend/tsconfig.json` extending a base config:
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "commonjs",
      "lib": ["ES2022"],
      "outDir": "./dist",
      "rootDir": "./src",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "declaration": true,
      "declarationMap": true,
      "sourceMap": true
    },
    "include": ["src/**/*.ts"],
    "exclude": ["node_modules", "dist"]
  }
  ```

### Step 1.3 — Create .env and .env.example

- Create `backend/.env.example` with all variables from specsheet §11 (placeholder values).
- Create `backend/.env` with development values (real secret, placeholder Google creds).
- Add `backend/.env` to `.gitignore`.

### Step 1.4 — Create .gitignore for backend

- Create `backend/.gitignore`:
  ```
  node_modules/
  dist/
  data/
  .env
  ```

### Step 1.5 — Create environment config loader

- Create `backend/src/config/env.ts`.
- Load dotenv, export a typed config object:
  ```ts
  export const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL!,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
    dbPath: process.env.DB_PATH || './data/rento.db',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
  ```
- Add startup validation: throw if `JWT_SECRET` is missing or < 32 chars.

### Step 1.6 — Create DB connection singleton

- Create `backend/src/db/index.ts`.
- Use `better-sqlite3` to open the database at `config.dbPath`.
- Ensure the `data/` directory exists before opening (create if missing).
- Enable WAL mode for concurrency: `db.pragma('journal_mode = WAL')`.
- Enable foreign keys: `db.pragma('foreign_keys = ON')`.
- Export the db instance as a singleton.

### Step 1.7 — Create migration runner

- Create `backend/src/db/migrations/` directory.
- Create `backend/src/db/migrate.ts` — a function that:
  1. Creates a `migrations` table if it doesn't exist:
     ```sql
     CREATE TABLE IF NOT EXISTS migrations (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       filename TEXT UNIQUE,
       applied_at TEXT DEFAULT (datetime('now'))
     );
     ```
  2. Reads all `.sql` files from `backend/src/db/migrations/` sorted by filename.
  3. For each file not already in the `migrations` table, executes it within a transaction and records it.
  4. Runs on every Express startup before routes are mounted.
- Create `backend/src/db/migrations/001_init.sql` with the auth tables:

```sql
CREATE TABLE IF NOT EXISTS users (
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
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS account_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  linked_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Step 1.8 — Create Express entry point

- Create `backend/src/index.ts`:
  1. Import config, db.
  2. Run migrations.
  3. Create Express app.
  4. Apply global middleware: `cors()`, `express.json()`, `cookieParser()`.
  5. CORS config: allow `frontendUrl` origin, credentials true.
  6. Mount a health check: `GET /api/health → { status: 'ok', timestamp }`.
  7. Listen on `config.port`.
- Confirm server starts and `/api/health` returns 200.

### Step 1.9 — Wire Vite proxy and root dev script

- Update `vite.config.ts` to add the proxy:
  ```ts
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
  ```
- Add `concurrently` to root `package.json` devDependencies.
- Add root scripts:
  ```json
  {
    "dev:backend": "cd backend && npm run dev",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
  }
  ```
- Verify: `npm run dev` starts both frontend (8080) and backend (3001), and `/api/health` is reachable via the Vite proxy.

### Step 1.10 — Install dependencies and verify

- Run `npm install` in `backend/`.
- Run `npm install` in root (for concurrently).
- Start the dev server, confirm:
  - Express logs "Listening on port 3001".
  - `GET http://localhost:3001/api/health` returns `{ status: 'ok' }`.
  - `GET http://localhost:8080/api/health` proxies through Vite successfully.
  - `data/rento.db` file created with `users`, `refresh_tokens`, `account_links`, and `migrations` tables.

---

## Phase 2 — Auth System (Local Strategy + JWT)

**Goal:** Implement phone+password registration, login, logout, and `/me` endpoint. JWT tokens issued as httpOnly cookies. Auth middleware protects routes.

### Step 2.1 — Create auth types and Zod schemas

- Create `backend/src/types/express.d.ts` — extend Express `Request` with `user` property:
  ```ts
  interface AuthUser {
    userId: string;
    email?: string;
    phone?: string;
    is_super_admin: boolean;
  }
  ```
- Create `backend/src/schemas/auth.schema.ts` with Zod schemas:
  - `registerSchema`: `{ name, phone, password }` (phone = Bangladesh format `/^01[3-9]\d{8}$/`, password min 8 chars)
  - `loginSchema`: `{ phone, password }`
  - `refreshSchema`: empty (token comes from cookie)
- All auth route handlers validate input with these schemas before processing.

### Step 2.2 — Create auth service

- Create `backend/src/services/auth.service.ts` with these functions:
  - `registerUser(data)` — hash password with bcrypt (cost 12), insert into `users` table, return user without password_hash. Generate UUID via `uuid` package.
  - `loginUser(phone, password)` — find user by phone, verify bcrypt hash, return user or throw.
  - `findUserById(id)` — select user by id, omit password_hash.
  - `findUserByPhone(phone)` — select user by phone.
  - `findUserByEmail(email)` — select user by email (for Google linking later).
  - All DB queries use parameterized statements exclusively.

### Step 2.3 — Create JWT token utilities

- Create `backend/src/utils/jwt.ts`:
  - `generateAccessToken(user: AuthUser): string` — signs JWT with `config.jwtSecret`, expiry from `config.jwtExpiresIn` (default 15m). Payload: `{ sub: userId, email?, phone?, is_super_admin }`.
  - `generateRefreshToken(userId: string): string` — generates a cryptographically random token (using `crypto.randomBytes(64)`).
  - `saveRefreshToken(userId, token)` — hash the token with SHA-256, store in `refresh_tokens` table with `expires_at` = now + 30 days.
  - `verifyRefreshToken(token)` — hash token, look up in `refresh_tokens`, check expiry, return user association.
  - `deleteRefreshToken(token)` — hash token, delete from `refresh_tokens`.
  - `deleteAllUserRefreshTokens(userId)` — delete all refresh tokens for a user (used on logout-all).
  - Cookie constants:
    ```ts
    export const ACCESS_TOKEN_COOKIE = 'rento_access_token';
    export const REFRESH_TOKEN_COOKIE = 'rento_refresh_token';
    export const ACCESS_COOKIE_OPTS = { httpOnly: true, sameSite: 'lax' as const, maxAge: 15 * 60 * 1000, secure: config.nodeEnv === 'production' };
    export const REFRESH_COOKIE_OPTS = { httpOnly: true, sameSite: 'lax' as const, maxAge: 30 * 24 * 60 * 60 * 1000, secure: config.nodeEnv === 'production' };
    ```

### Step 2.4 — Create auth middleware

- Create `backend/src/middleware/auth.ts`:
  - `requireAuth` middleware:
    1. Read `ACCESS_TOKEN_COOKIE` from request cookies.
    2. If missing → 401.
    3. Verify JWT with `config.jwtSecret`.
    4. Attach `req.user` with decoded payload (`{ userId, email?, phone?, is_super_admin }`).
    5. Call `next()`.
  - `optionalAuth` middleware — same as requireAuth but does not 401 if no token (sets `req.user` to null).
- Export these as named exports.

### Step 2.5 — Create auth routes

- Create `backend/src/routes/auth.ts` with Express Router.
- Implement these endpoints:

**`POST /api/auth/register`**
1. Validate body with `registerSchema`.
2. Check if phone already exists → 409 if so.
3. Call `registerUser(data)`.
4. Generate access + refresh tokens.
5. Set both as httpOnly cookies.
6. Return `{ user, accessToken }` (201).

**`POST /api/auth/login`**
1. Validate body with `loginSchema`.
2. Call `loginUser(phone, password)`.
3. If user not found or password wrong → 401 with generic message "Invalid credentials".
4. Generate access + refresh tokens.
5. Set cookies.
6. Return `{ user, accessToken }`.

**`POST /api/auth/logout`**
1. Read refresh token from cookie.
2. If present, delete it from `refresh_tokens` table.
3. Clear both cookies (set maxAge to 0).
4. Return `{ message: 'Logged out' }`.

**`GET /api/auth/me`** (protected by `requireAuth`)
1. `req.user` is already populated by middleware.
2. Fetch full user from DB by `req.user.userId`.
3. Also fetch user's org memberships (empty for now — will be populated in Phase 4).
4. Return `{ user, orgs: [] }`.

### Step 2.6 — Mount auth routes

- In `backend/src/index.ts`, import `authRoutes` from `./routes/auth`.
- Mount: `app.use('/api/auth', authRoutes)`.

### Step 2.7 — Add rate limiting to auth endpoints

- Create `backend/src/middleware/rateLimit.ts`:
  - Auth rate limiter: 10 requests per 15 minutes per IP.
  - Use `express-rate-limit`.
- Apply the limiter to `/api/auth/login` and `/api/auth/register` routes specifically (not globally).

### Step 2.8 — Add error handling middleware

- Create `backend/src/middleware/errorHandler.ts`:
  - Global Express error handler (4 args: `err, req, res, next`).
  - If `err instanceof ZodError` → 400 with formatted validation errors.
  - If `err` has a `statusCode` property → use it.
  - Otherwise → 500 with generic message.
  - In development, include stack trace in response.
  - Log errors to console in all environments.
- Mount as the last middleware in `index.ts`: `app.use(errorHandler)`.

### Step 2.9 — Verify auth endpoints

- Start dev server.
- Test with curl or HTTP client:
  - `POST /api/auth/register` with `{ name, phone, password }` → 201, cookies set.
  - `POST /api/auth/login` with same credentials → 200, cookies set.
  - `GET /api/auth/me` with access token cookie → 200 with user data.
  - `POST /api/auth/logout` → clears cookies.
  - `GET /api/auth/me` without token → 401.
  - `POST /api/auth/register` with duplicate phone → 409.
  - `POST /api/auth/login` with wrong password → 401.

---

## Phase 3 — Google OAuth & Token Refresh

**Goal:** Add Google OAuth 2.0 login via Passport, implement the full OAuth callback flow with account linking, and add the refresh token endpoint.

### Step 3.1 — Create Passport Google OAuth strategy

- Create `backend/src/strategies/google.strategy.ts`:
  - Configure `passport-google-oauth20` Strategy with:
    - `clientID`: `config.googleClientId`
    - `clientSecret`: `config.googleClientSecret`
    - `callbackURL`: `config.googleCallbackUrl`
    - `scope`: `['profile', 'email']`
  - Verify callback logic (specsheet §3.2):
    1. If `google_id` exists in `users` table → return that user.
    2. If `email` matches an existing user → link accounts:
       - Update the user row to set `google_id`.
       - Insert a row into `account_links` (id, user_id, provider='google', provider_id=google_sub, linked_at).
       - Return the linked user.
    3. New user → create user with `google_id`, `email`, `name`, `avatar_url`, `password_hash = null`, `phone = null`.

### Step 3.2 — Create Passport local strategy

- Create `backend/src/strategies/local.strategy.ts`:
  - Configure `passport-local` Strategy with `usernameField: 'phone'`, `passwordField: 'password'`.
  - Verify callback: find user by phone, compare bcrypt hash, return user or `false`.
- This replaces the manual phone+password verification in the login route — the route handler will instead use `passport.authenticate('local', { session: false })`.

### Step 3.3 — Initialize Passport in the app

- In `backend/src/index.ts`:
  - `import passport from 'passport'`.
  - Call `app.use(passport.initialize())` (no sessions — JWT only).
  - Import both strategy files so they register themselves with Passport.

### Step 3.4 — Refactor login route to use Passport local strategy

- Update `POST /api/auth/login` in `backend/src/routes/auth.ts`:
  - Replace manual phone+password check with `passport.authenticate('local', { session: false })`.
  - In the custom callback: if authentication failed → 401. If succeeded → generate tokens, set cookies, return user.
- Keep register route as-is (direct service call).

### Step 3.5 — Add Google OAuth routes

- In `backend/src/routes/auth.ts`, add:

**`GET /api/auth/google`**
- Calls `passport.authenticate('google', { session: false })` — redirects to Google consent screen.

**`GET /api/auth/google/callback`**
- Uses `passport.authenticate('google', { session: false, failureRedirect: '/login?error=google' })`.
- In custom callback after successful auth:
  1. Get user from Passport (`req.user`).
  2. Generate access + refresh tokens.
  3. Set both as httpOnly cookies.
  4. Redirect to `config.frontendUrl` (e.g., `http://localhost:8080`) — the frontend will read the cookie on the next `/me` call.

### Step 3.6 — Add link-google endpoint

**`POST /api/auth/link-google`** (protected by `requireAuth`)
- This is for users who already have a phone/password account and want to link their Google identity.
- Accept body: not needed — the linking happens via a separate OAuth flow.
- Implementation approach:
  1. Generate a short-lived link token, store it with `user_id`, and return a URL to `GET /api/auth/google?link_token=<token>`.
  2. Alternatively, simplify: since Google OAuth redirects away, we'll implement link-google as follows:
     - `POST /api/auth/link-google` initiates linking by returning a URL: `${config.frontendUrl}/api/auth/google?link=1&user_id=${req.user.userId}`.
     - The Google callback handler checks for a `link` query param and the currently authenticated user, then links rather than creates.
  3. **Simpler approach (recommended)**: Store intended link in a temporary DB table or session. On Google callback, check if a `link_user_id` is present in the state parameter. If so, link the returned Google identity to that user instead of creating a new one.
- Implementation:
  - The route `POST /api/auth/link-google` requires `requireAuth`. It generates a `state` token (JWT with `{ purpose: 'link', userId }`, 10min expiry) and returns `{ url: /api/auth/google?state=<state> }`.
  - The Google auth route passes `state` to Passport.
  - The callback verifies the state token: if `purpose === 'link'`, it links the Google ID to the `userId` instead of creating a new user.

### Step 3.7 — Add token refresh endpoint

**`POST /api/auth/refresh`**
- Read `REFRESH_TOKEN_COOKIE` from request cookies.
- If missing → 401.
- Call `verifyRefreshToken(token)` from `jwt.ts` — validates hash, checks expiry.
- If invalid or expired → 401, clear refresh cookie.
- If valid: generate new access token, set as cookie.
- Optionally rotate the refresh token too (delete old, create new).
- Return `{ accessToken }` in body as well (for clients that can't read httpOnly cookies).

### Step 3.8 — Verify OAuth and refresh endpoints

- Start dev server.
- Test:
  - `POST /api/auth/refresh` with valid refresh cookie → 200, new access token cookie set.
  - `POST /api/auth/refresh` with no cookie → 401.
  - `POST /api/auth/refresh` with expired/invalid token → 401.
  - `GET /api/auth/google` → redirects to Google (test with real Google credentials later).
  - `POST /api/auth/link-google` with auth → returns URL with state token.
- Note: Full Google OAuth E2E test requires real Google credentials and a public callback URL. For local development, the phone+password flow remains the primary auth method.

---

## Phase 4 — Org & RBAC Foundation

**Goal:** Create the organizations, org_members, roles, and role_permissions tables. Implement org creation flow, orgScope middleware, RBAC middleware, and seed default roles.

### Step 4.1 — Create 002_orgs.sql migration

- Create `backend/src/db/migrations/002_orgs.sql`:

```sql
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  org_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_system INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id TEXT PRIMARY KEY,
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  UNIQUE(role_id, permission)
);

CREATE TABLE IF NOT EXISTS org_members (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  invited_by TEXT REFERENCES users(id),
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(org_id, user_id)
);
```

- Restart dev server to trigger migration.

### Step 4.2 — Create RBAC service

- Create `backend/src/services/rbac.service.ts`:
  - `getPermissionsForRole(roleId)` — SELECT all permissions from `role_permissions` WHERE `role_id = ?`.
  - `getUserPermissionsInOrg(userId, orgId)` — join `org_members` → `roles` → `role_permissions` to get all permissions for the user's role in that org.
  - `hasPermission(userId, orgId, permission)` — check if user has a specific permission. Returns true if:
    1. User is `super_admin`, OR
    2. User's role in the org includes the exact `resource.action` permission, OR
    3. User's role includes the wildcard `*` permission.
  - `getUserRoleInOrg(userId, orgId)` — return the role row for the user's membership in the org.

### Step 4.3 — Create orgScope middleware

- Create `backend/src/middleware/orgScope.ts`:
  - `requireOrgMember` middleware:
    1. Read `X-Org-Id` header from request.
    2. If missing → 400 "X-Org-Id header required".
    3. Check `org_members` table: does `req.user.userId` belong to this org?
    4. If yes → attach `req.org = { id: orgId }` and `req.orgMember = { roleId }`.
    5. If user is super_admin → allow without membership check, but still set `req.org`.
    6. If no membership and not super_admin → 403 "Not a member of this organization".
  - Export as default export and named export.

### Step 4.4 — Create RBAC middleware

- Create `backend/src/middleware/rbac.ts`:
  - `requirePermission(permission: string)` — returns middleware that:
    1. Calls `hasPermission(req.user.userId, req.org.id, permission)`.
    2. If true → `next()`.
    3. If false → 403 "Insufficient permissions".
  - Contract: must be used **after** `requireAuth` and `requireOrgMember` (needs `req.user` and `req.org`).

### Step 4.5 — Seed default roles and permissions

- Create `backend/src/db/seed.ts`:
  - Function `seedDefaultRoles()` — idempotent (check if `is_system = 1` roles exist before inserting).
  - Create these system roles with `org_id = NULL` and `is_system = 1`:

| Role | Permissions |
|------|------------|
| `super_admin` | `*` |
| `property_manager` | `orgs.*`, `buildings.*`, `units.*`, `tenants.*`, `flat_owners.*`, `payments.*`, `expenses.*`, `invoices.*`, `roles.*`, `members.*` |
| `building_manager` | `buildings.*`, `units.*`, `tenants.*`, `flat_owners.*`, `payments.*`, `expenses.*`, `invoices.*` |
| `cashier` | `payments.read`, `payments.write`, `expenses.read`, `expenses.write`, `invoices.read`, `invoices.write`, `tenants.read` |
| `member` | `*.read` — `orgs.read`, `buildings.read`, `units.read`, `tenants.read`, `flat_owners.read`, `payments.read`, `expenses.read`, `invoices.read`, `roles.read`, `members.read` |
| `owner` | `units.read`, `tenants.read`, `payments.read`, `invoices.read` |
| `tenant` | `payments.read`, `invoices.read` |

  - For each role, insert into `roles` table with UUID, then insert `role_permissions` rows.
  - Call `seedDefaultRoles()` at startup after migrations.

### Step 4.6 — Create org service

- Create `backend/src/services/org.service.ts`:
  - `createOrg(name, slug, ownerUserId)` — insert into `organizations`, then add owner as `org_member` with `property_manager` role. Return org.
  - `generateSlug(name)` — lowercase, replace spaces with hyphens, remove special chars, append short random suffix for uniqueness.
  - `getOrgById(orgId)` — select org by id.
  - `listUserOrgs(userId)` — select all orgs where user is a member.
  - `getOrgMembers(orgId)` — join `org_members` with `users` and `roles` to return member list with name, email, role name.
  - `updateOrg(orgId, data)` — update name/slug/plan.
  - `deactivateOrg(orgId)` — set `is_active = 0`.
  - All queries must include `WHERE org_id = ?` (org scoping enforced by service layer as well as middleware).

### Step 4.7 — Create org routes

- Create `backend/src/routes/orgs.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| POST | /api/orgs | requireAuth | createOrg |
| GET | /api/orgs/mine | requireAuth | listUserOrgs |
| GET | /api/orgs/:id | requireAuth, requireOrgMember, requirePermission('orgs.read') | getOrgById |
| PUT | /api/orgs/:id | requireAuth, requireOrgMember, requirePermission('orgs.write') | updateOrg |
| DELETE | /api/orgs/:id | requireAuth, requireOrgMember, requirePermission('orgs.delete') | deactivateOrg |

- Create Zod schemas in `backend/src/schemas/org.schema.ts`:
  - `createOrgSchema`: `{ name: z.string().min(1), slug?: z.string() }`
  - `updateOrgSchema`: `{ name?: z.string(), slug?: z.string(), plan?: z.enum(['free', 'pro']) }`

### Step 4.8 — Mount org routes and verify

- In `backend/src/index.ts`, mount `app.use('/api/orgs', orgRoutes)`.
- Test:
  - `POST /api/orgs` with auth cookie → creates org, owner auto-joined as `property_manager`.
  - `GET /api/orgs/mine` → returns user's orgs.
  - `GET /api/orgs/:id` with `X-Org-Id` header → returns org details.
  - `GET /api/orgs/:id` without membership → 403.
  - `PUT /api/orgs/:id` with `orgs.write` permission → updates org.

---

## Phase 5 — Org Member Management & Custom Roles

**Goal:** Implement invite members, member CRUD, role changes, and custom role CRUD endpoints.

### Step 5.1 — Create member service

- Create `backend/src/services/member.service.ts`:
  - `addMember(orgId, userId, roleId, invitedBy)` — insert into `org_members`. Validate user exists and is not already a member.
  - `removeMember(orgId, userId)` — delete from `org_members`. Cannot remove org owner (check `organizations.owner_id`).
  - `changeMemberRole(orgId, userId, newRoleId)` — update `role_id` in `org_members`.
  - `getMemberDetail(orgId, userId)` — join `org_members` + `users` + `roles` to return full member info.
  - All functions enforce org scoping by requiring `orgId`.

### Step 5.2 — Create member routes (nested under orgs)

- Add to `backend/src/routes/orgs.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| POST | /api/orgs/:id/invite | requireAuth, requireOrgMember, requirePermission('members.write') | inviteMember |
| GET | /api/orgs/:id/members | requireAuth, requireOrgMember, requirePermission('members.read') | listMembers |
| PUT | /api/orgs/:id/members/:userId | requireAuth, requireOrgMember, requirePermission('members.write') | changeMemberRole |
| DELETE | /api/orgs/:id/members/:userId | requireAuth, requireOrgMember, requirePermission('members.delete') | removeMember |

### Step 5.3 — Implement invite member endpoint

**`POST /api/orgs/:id/invite`**
- Validate body: `{ email?: string, phone?: string, roleId: string }` (at least one of email/phone required).
- Look up user by email or phone. If not found → 404 "User not found. Ask them to register first."
- Validate the roleId exists and belongs to the same org (or is a system role).
- Check that user is not already a member → 409 if already a member.
- Call `addMember(orgId, userId, roleId, req.user.userId)`.
- Return 201 with member details.

### Step 5.4 — Implement list members endpoint

**`GET /api/orgs/:id/members`**
- Call `getOrgMembers(orgId)`.
- Return array of `{ id, userId, name, email, phone, roleName, roleId, joinedAt }`.

### Step 5.5 — Implement change member role endpoint

**`PUT /api/orgs/:id/members/:userId`**
- Validate body: `{ roleId: string }`.
- Validate roleId exists and belongs to this org or is a system role.
- Cannot change org owner's role → 403.
- Call `changeMemberRole(orgId, userId, roleId)`.
- Return 200 with updated member info.

### Step 5.6 — Implement remove member endpoint

**`DELETE /api/orgs/:id/members/:userId`**
- Cannot remove org owner → 403.
- Call `removeMember(orgId, userId)`.
- Return 200 `{ message: 'Member removed' }`.

### Step 5.7 — Create custom role routes and service

- Create `backend/src/routes/roles.ts` and add role service methods to `backend/src/services/rbac.service.ts`:

**New service methods:**
  - `createCustomRole(orgId, name, permissions[])` — insert role with `org_id`, then insert `role_permissions` rows. Cannot use names that match system roles.
  - `updateCustomRole(roleId, name?, permissions?)` — update role and replace all `role_permissions`. Cannot update system roles (`is_system = 1`).
  - `deleteCustomRole(roleId)` — cannot delete system roles. Before deleting, reassign all `org_members` with this role to the `member` role.
  - `listRoles(orgId)` — return all roles (system + org-specific) with their permissions.

**Routes:**

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/roles | requireAuth, requireOrgMember, requirePermission('roles.read') | listRoles |
| POST | /api/roles | requireAuth, requireOrgMember, requirePermission('roles.write') | createRole |
| PUT | /api/roles/:id | requireAuth, requireOrgMember, requirePermission('roles.write') | updateRole |
| DELETE | /api/roles/:id | requireAuth, requireOrgMember, requirePermission('roles.delete') | deleteRole |

- Create Zod schemas in `backend/src/schemas/role.schema.ts`:
  - `createRoleSchema`: `{ name: z.string().min(1), permissions: z.array(z.string()) }`
  - `updateRoleSchema`: `{ name?: z.string(), permissions?: z.array(z.string()) }`

### Step 5.8 — Mount roles routes and verify

- In `backend/src/index.ts`, mount `app.use('/api/roles', roleRoutes)`.
- Test:
  - `GET /api/roles` with `X-Org-Id` → returns system roles + any custom roles for the org.
  - `POST /api/roles` → creates custom role with permissions.
  - `PUT /api/roles/:id` → updates custom role name/permissions.
  - `DELETE /api/roles/:id` on system role → 403.
  - `POST /api/orgs/:id/invite` → adds member to org.
  - `GET /api/orgs/:id/members` → lists members.
  - `PUT /api/orgs/:id/members/:userId` → changes role.
  - `DELETE /api/orgs/:id/members/:userId` → removes member.

---

## Phase 6 — Property CRUD (Buildings, Units, Owners, Tenants)

**Goal:** Create property tables and full CRUD for buildings, units, flat owners, and tenants. All endpoints org-scoped and permission-protected.

### Step 6.1 — Create 003_properties.sql migration

- Create `backend/src/db/migrations/003_properties.sql`:

```sql
CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  total_floors INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  building_id TEXT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  floor TEXT,
  size_sqft INTEGER,
  rent_amount INTEGER,
  service_charge INTEGER,
  status TEXT NOT NULL DEFAULT 'vacant',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS flat_owners (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  phone TEXT,
  nid TEXT,
  since TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  phone TEXT,
  nid TEXT,
  move_in_date TEXT,
  advance_amount INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

- Restart dev server to trigger migration.

### Step 6.2 — Create building service

- Create `backend/src/services/building.service.ts`:
  - `createBuilding(orgId, data)` — insert into `buildings`. Generate UUID. Data: `{ name, address, total_floors }`.
  - `listBuildings(orgId)` — SELECT all buildings for org. ORDER BY created_at DESC.
  - `getBuildingById(buildingId, orgId)` — single building, enforce `org_id` match.
  - `updateBuilding(buildingId, orgId, data)` — update fields, enforce org scoping.
  - `deleteBuilding(buildingId, orgId)` — delete building (cascades to units, flat_owners, tenants via FK).
  - All service functions enforce `org_id` in WHERE clause.

### Step 6.3 — Create building routes

- Create `backend/src/routes/buildings.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/buildings | requireAuth, requireOrgMember, requirePermission('buildings.read') | listBuildings |
| POST | /api/buildings | requireAuth, requireOrgMember, requirePermission('buildings.write') | createBuilding |
| GET | /api/buildings/:id | requireAuth, requireOrgMember, requirePermission('buildings.read') | getBuilding |
| PUT | /api/buildings/:id | requireAuth, requireOrgMember, requirePermission('buildings.write') | updateBuilding |
| DELETE | /api/buildings/:id | requireAuth, requireOrgMember, requirePermission('buildings.delete') | deleteBuilding |

- Create Zod schemas in `backend/src/schemas/building.schema.ts`:
  - `createBuildingSchema`: `{ name: z.string().min(1), address?: z.string(), total_floors?: z.number().int() }`
  - `updateBuildingSchema`: partial version of create.

- Add building count to `getBuildingById` response: include `unitCount` (COUNT from units table).

### Step 6.4 — Create unit service

- Create `backend/src/services/unit.service.ts`:
  - `createUnit(orgId, data)` — insert into `units`. Data: `{ building_id, unit_number, floor, size_sqft, rent_amount, service_charge, status }`. Validate building belongs to same org.
  - `listUnits(orgId, filters?)` — supports filtering by `building_id` and `status`. All queries include `WHERE org_id = ?`.
  - `getUnitById(unitId, orgId)` — single unit, enforce org scoping.
  - `updateUnit(unitId, orgId, data)` — update fields.
  - `deleteUnit(unitId, orgId)` — delete unit.
  - When unit is created/updated with `status = 'occupied'`, no automatic tenant creation (handled explicitly).

### Step 6.5 — Create unit routes

- Create `backend/src/routes/units.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/units | requireAuth, requireOrgMember, requirePermission('units.read') | listUnits |
| POST | /api/units | requireAuth, requireOrgMember, requirePermission('units.write') | createUnit |
| GET | /api/units/:id | requireAuth, requireOrgMember, requirePermission('units.read') | getUnit |
| PUT | /api/units/:id | requireAuth, requireOrgMember, requirePermission('units.write') | updateUnit |
| DELETE | /api/units/:id | requireAuth, requireOrgMember, requirePermission('units.delete') | deleteUnit |

- Query param support: `GET /api/units?building_id=xxx&status=vacant`.

### Step 6.6 — Create tenant service

- Create `backend/src/services/tenant.service.ts`:
  - `createTenant(orgId, data)` — insert into `tenants`. Validate unit belongs to same org.
  - `listTenants(orgId, filters?)` — supports filtering by `unit_id` and `status`.
  - `getTenantById(tenantId, orgId)` — tenant details + unit info + payment history (last 6 months).
  - `updateTenant(tenantId, orgId, data)` — update tenant fields.
  - `deactivateTenant(tenantId, orgId)` — set `status = 'inactive'` (soft delete, not row delete).

### Step 6.7 — Create tenant routes

- Create `backend/src/routes/tenants.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/tenants | requireAuth, requireOrgMember, requirePermission('tenants.read') | listTenants |
| POST | /api/tenants | requireAuth, requireOrgMember, requirePermission('tenants.write') | createTenant |
| GET | /api/tenants/:id | requireAuth, requireOrgMember, requirePermission('tenants.read') | getTenant |
| PUT | /api/tenants/:id | requireAuth, requireOrgMember, requirePermission('tenants.write') | updateTenant |
| DELETE | /api/tenants/:id | requireAuth, requireOrgMember, requirePermission('tenants.delete') | deactivateTenant |

- Query param support: `GET /api/tenants?unit_id=xxx&status=active`.

### Step 6.8 — Create flat owner service and routes

- Create `backend/src/services/flatOwner.service.ts`:
  - `createFlatOwner(orgId, data)` — insert into `flat_owners`. Validate unit belongs to same org.
  - `listFlatOwners(orgId, filters?)` — filtering by `unit_id` and `status`.
  - `getFlatOwnerById(id, orgId)` — flat owner details + unit info.
  - `updateFlatOwner(id, orgId, data)` — update fields.
  - `deactivateFlatOwner(id, orgId)` — set `status = 'inactive'`.

- Create `backend/src/routes/flatOwners.ts` (note: route path is `/api/flat-owners` with hyphen):

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/flat-owners | requireAuth, requireOrgMember, requirePermission('flat_owners.read') | listFlatOwners |
| POST | /api/flat-owners | requireAuth, requireOrgMember, requirePermission('flat_owners.write') | createFlatOwner |
| GET | /api/flat-owners/:id | requireAuth, requireOrgMember, requirePermission('flat_owners.read') | getFlatOwner |
| PUT | /api/flat-owners/:id | requireAuth, requireOrgMember, requirePermission('flat_owners.write') | updateFlatOwner |
| DELETE | /api/flat-owners/:id | requireAuth, requireOrgMember, requirePermission('flat_owners.delete') | deactivateFlatOwner |

### Step 6.9 — Mount all property routes and verify

- In `backend/src/index.ts`:
  ```ts
  app.use('/api/buildings', buildingRoutes);
  app.use('/api/units', unitRoutes);
  app.use('/api/tenants', tenantRoutes);
  app.use('/api/flat-owners', flatOwnerRoutes);
  ```
- Test each CRUD endpoint:
  - Create building → 201, list buildings → 200, update building → 200, delete building → 200.
  - Create unit under building → 201, list units by building → 200.
  - Create tenant under unit → 201, get tenant includes payment history.
  - Create flat owner → 201, list flat owners → 200.
  - Cross-org access → 403 (use different org's ID in X-Org-Id).

---

## Phase 7 — Financial CRUD (Payments, Expenses, Account Payables)

**Goal:** Create financial tables and CRUD for payments, expenses, and account payables. All org-scoped.

### Step 7.1 — Create 004_financial.sql migration

- Create `backend/src/db/migrations/004_financial.sql`:

```sql
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('rent', 'service_charge', 'advance', 'utility')),
  month TEXT NOT NULL,
  method TEXT NOT NULL CHECK(method IN ('bkash', 'nagad', 'cash', 'bank_transfer')),
  status TEXT NOT NULL DEFAULT 'due' CHECK(status IN ('paid', 'due', 'overdue')),
  paid_at TEXT,
  recorded_by TEXT NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  building_id TEXT REFERENCES buildings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('maintenance', 'repair', 'cleaning', 'salary', 'utilities', 'other')),
  date TEXT NOT NULL,
  added_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS account_payables (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  pay_to TEXT NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid')),
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

- Restart dev server to trigger migration.

### Step 7.2 — Create payment service

- Create `backend/src/services/payment.service.ts`:
  - `createPayment(orgId, data, recordedBy)` — insert into `payments`. Data: `{ tenant_id, unit_id, amount, type, month, method, notes }`. Status defaults to `'due'`. Validate tenant and unit belong to the same org.
  - `listPayments(orgId, filters?)` — supports filtering by `month`, `status`, `unit_id`, `tenant_id`. All queries include `WHERE org_id = ?`.
  - `getPaymentById(paymentId, orgId)` — single payment with tenant name and unit number joined.
  - `markPaymentAsPaid(paymentId, orgId, paidAt)` — set `status = 'paid'`, `paid_at = paidAt || datetime('now')`.
  - `deletePayment(paymentId, orgId)` — hard delete (admin action only).

### Step 7.3 — Create payment routes

- Create `backend/src/routes/payments.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/payments | requireAuth, requireOrgMember, requirePermission('payments.read') | listPayments |
| POST | /api/payments | requireAuth, requireOrgMember, requirePermission('payments.write') | createPayment |
| GET | /api/payments/:id | requireAuth, requireOrgMember, requirePermission('payments.read') | getPayment |
| PUT | /api/payments/:id/mark-paid | requireAuth, requireOrgMember, requirePermission('payments.write') | markPaymentAsPaid |
| DELETE | /api/payments/:id | requireAuth, requireOrgMember, requirePermission('payments.delete') | deletePayment |

- Create Zod schemas in `backend/src/schemas/payment.schema.ts`:
  - `createPaymentSchema`: `{ tenant_id: z.string(), unit_id: z.string(), amount: z.number().int().positive(), type: z.enum([...]), month: z.string().regex(/^\d{4}-\d{2}$/), method: z.enum([...]), notes?: z.string() }`
  - `listPaymentsQuerySchema`: `{ month?: z.string(), status?: z.enum([...]), unit_id?: z.string(), tenant_id?: z.string() }`

### Step 7.4 — Create expense service

- Create `backend/src/services/expense.service.ts`:
  - `createExpense(orgId, data, addedBy)` — insert into `expenses`. Data: `{ building_id?, description, amount, category, date }`. If `building_id` provided, validate it belongs to same org.
  - `listExpenses(orgId, filters?)` — filtering by `month` (date range), `category`, `building_id`.
  - `getExpenseById(expenseId, orgId)` — single expense.
  - `updateExpense(expenseId, orgId, data)` — update fields.
  - `deleteExpense(expenseId, orgId)` — hard delete.

### Step 7.5 — Create expense routes

- Create `backend/src/routes/expenses.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/expenses | requireAuth, requireOrgMember, requirePermission('expenses.read') | listExpenses |
| POST | /api/expenses | requireAuth, requireOrgMember, requirePermission('expenses.write') | createExpense |
| GET | /api/expenses/:id | requireAuth, requireOrgMember, requirePermission('expenses.read') | getExpense |
| PUT | /api/expenses/:id | requireAuth, requireOrgMember, requirePermission('expenses.write') | updateExpense |
| DELETE | /api/expenses/:id | requireAuth, requireOrgMember, requirePermission('expenses.delete') | deleteExpense |

- Zod schemas in `backend/src/schemas/expense.schema.ts`.

### Step 7.6 — Create account payable service and routes

- Create `backend/src/services/accountPayable.service.ts`:
  - `createAccountPayable(orgId, data)` — insert into `account_payables`.
  - `listAccountPayables(orgId, filters?)` — filtering by `status`.
  - `markAccountPayableAsPaid(id, orgId)` — set `status = 'paid'`, `paid_at`.
  - `deleteAccountPayable(id, orgId)`.

- Create `backend/src/routes/accountPayables.ts` (route path: `/api/account-payables`):

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/account-payables | requireAuth, requireOrgMember, requirePermission('payments.read') | listPayables |
| POST | /api/account-payables | requireAuth, requireOrgMember, requirePermission('payments.write') | createPayable |
| PUT | /api/account-payables/:id/mark-paid | requireAuth, requireOrgMember, requirePermission('payments.write') | markPayableAsPaid |
| DELETE | /api/account-payables/:id | requireAuth, requireOrgMember, requirePermission('payments.delete') | deletePayable |

### Step 7.7 — Mount financial routes and verify

- In `backend/src/index.ts`:
  ```ts
  app.use('/api/payments', paymentRoutes);
  app.use('/api/expenses', expenseRoutes);
  app.use('/api/account-payables', accountPayableRoutes);
  ```
- Test:
  - Create payment → 201, list payments with filters → 200.
  - Mark payment as paid → 200, status becomes `paid`.
  - Create expense → 201, list expenses by category → 200.
  - Create account payable → 201, mark as paid → 200.
  - All endpoints reject cross-org access → 403.

---

## Phase 8 — Invoice System

**Goal:** Create the invoices table, implement invoice CRUD, line items, invoice number generation, printable HTML view, and bulk invoice generation.

### Step 8.1 — Create invoices migration

- Note: The `invoices` table was **not** included in the `004_financial.sql` migration. Create it as a separate migration.
- Create `backend/src/db/migrations/005_invoices.sql`:

```sql
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  line_items TEXT NOT NULL DEFAULT '[]',
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'issued', 'paid')),
  issued_at TEXT,
  due_date TEXT,
  paid_at TEXT,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_invoices_org_month ON invoices(org_id, month);
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

- Also add the `invoice_seq` tracking table for atomic invoice number generation:

```sql
CREATE TABLE IF NOT EXISTS invoice_sequences (
  org_id TEXT PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  current_year TEXT NOT NULL,
  current_seq INTEGER NOT NULL DEFAULT 0
);
```

### Step 8.2 — Create invoice service

- Create `backend/src/services/invoice.service.ts`:

**Invoice number generation:**
- `generateInvoiceNumber(orgId)` — atomically increment sequence:
  1. Get current year: `new Date().getFullYear().toString()`.
  2. `INSERT OR REPLACE` into `invoice_sequences`: if row exists for `org_id` and `current_year` matches, increment `current_seq`; if year changed, reset to 1.
  3. Format: `INV-{YYYY}-{zero-padded-seq(5 digits)}` → e.g., `INV-2026-00001`.
  4. Use a transaction to ensure atomicity.

**Core methods:**
- `createInvoice(orgId, data, createdBy)` — insert into `invoices`. Data: `{ tenant_id, unit_id, month, line_items, due_date }`. Auto-generate `invoice_number`. Calculate `total_amount` from sum of line_item amounts. Validate tenant and unit belong to same org. Default status = `'draft'`.
- `listInvoices(orgId, filters?)` — filtering by `month`, `status`, `tenant_id`, `unit_id`.
- `getInvoiceById(invoiceId, orgId)` — full invoice with tenant name, unit number, building name, org name.
- `issueInvoice(invoiceId, orgId)` — set `status = 'issued'`, `issued_at = now()`.
- `markInvoiceAsPaid(invoiceId, orgId)` — set `status = 'paid'`, `paid_at = now()`. Optionally auto-create a payment record (link to payments table).
- `deleteInvoice(invoiceId, orgId)` — hard delete.

**Line items:**
- `line_items` is stored as JSON string. On create, accept array `[{ label, amount }]`. Validate: each item has `label` (string) and `amount` (integer, can be negative for adjustments). Calculate `total_amount` as sum.
- On read, parse JSON string back to array.

### Step 8.3 — Create invoice routes

- Create `backend/src/routes/invoices.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/invoices | requireAuth, requireOrgMember, requirePermission('invoices.read') | listInvoices |
| POST | /api/invoices | requireAuth, requireOrgMember, requirePermission('invoices.write') | createInvoice |
| GET | /api/invoices/:id | requireAuth, requireOrgMember, requirePermission('invoices.read') | getInvoice |
| PUT | /api/invoices/:id/mark-paid | requireAuth, requireOrgMember, requirePermission('invoices.write') | markInvoiceAsPaid |
| DELETE | /api/invoices/:id | requireAuth, requireOrgMember, requirePermission('invoices.delete') | deleteInvoice |

- Zod schemas in `backend/src/schemas/invoice.schema.ts`:
  - `createInvoiceSchema`: `{ tenant_id, unit_id, month: 'YYYY-MM', line_items: z.array(z.object({ label: z.string(), amount: z.number().int() })), due_date?: string }`
  - `listInvoicesQuerySchema`: `{ month?, status?, tenant_id?, unit_id? }`

### Step 8.4 — Create printable HTML invoice endpoint

**`GET /api/invoices/:id/print`** (requireAuth, requireOrgMember, requirePermission('invoices.read'))

- Fetch full invoice data with joins: org name, org address, tenant name, tenant phone, unit number, building name, line items, total, status, issue date, due date.
- Generate a standalone HTML page:
  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>Invoice {invoice_number}</title>
    <style>
      /* Inline CSS for print-friendly layout */
      body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
      .header { display: flex; justify-content: space-between; }
      .status-badge { padding: 4px 12px; border-radius: 4px; }
      .status-paid { background: #dcfce7; color: #166534; }
      .status-issued { background: #dbeafe; color: #1e40af; }
      .status-draft { background: #f3f4f6; color: #374151; }
      .signature-line { border-top: 1px solid #000; width: 200px; margin-top: 60px; }
      @media print {
        .no-print { display: none; }
      }
    </style>
  </head>
  <body>
    <!-- Header: Org name, invoice number, dates -->
    <!-- Tenant & unit info -->
    <!-- Line items table -->
    <!-- Total in BDT -->
    <!-- Payment status badge -->
    <!-- Payment method (if paid) -->
    <!-- Authorized signature line -->
    <!-- Print button (hidden in @media print) -->
  </body>
  </html>
  ```
- Set `Content-Type: text/html` and return the rendered HTML.
- The print button uses `window.print()` to trigger browser print dialog.

### Step 8.5 — Create bulk invoice generation endpoint

**`POST /api/invoices/bulk`** (requireAuth, requireOrgMember, requirePermission('invoices.write'))

- Accept body: `{ month: 'YYYY-MM', due_date?: string }`.
- Logic:
  1. Get all active tenants for the org: `SELECT * FROM tenants WHERE org_id = ? AND status = 'active'`.
  2. Check which tenants already have an invoice for this month: `SELECT tenant_id FROM invoices WHERE org_id = ? AND month = ?`.
  3. For each tenant without an invoice:
     - Get tenant's unit details (rent_amount, service_charge).
     - Auto-generate line items:
       ```json
       [
         { "label": "Rent — {month_name} {year}", "amount": unit.rent_amount },
         { "label": "Service Charge", "amount": unit.service_charge }
       ]
       ```
     - Create invoice with `status = 'draft'`, `due_date = due_date || last day of month`.
  4. Return `{ created: number, skipped: number, invoices: [...] }`.

### Step 8.6 — Mount invoice routes and verify

- In `backend/src/index.ts`:
  ```ts
  app.use('/api/invoices', invoiceRoutes);
  ```
- Test:
  - Create single invoice → 201, invoice_number auto-generated as `INV-2026-00001`.
  - List invoices with filters → 200.
  - Mark invoice as paid → 200, `paid_at` set.
  - GET invoice print → 200, returns standalone HTML.
  - Bulk generate invoices for a month → 201, creates invoices for all active tenants, skips those with existing invoices.
  - Delete draft invoice → 200.

---

## Phase 9 — Dashboard, Reports & Admin

**Goal:** Implement dashboard aggregation, monthly reports, payment status reports, and super admin endpoints.

### Step 9.1 — Create dashboard service

- Create `backend/src/services/dashboard.service.ts`:
  - `getDashboardData(orgId)` — return an aggregated object:
    ```ts
    {
      buildings: number,
      totalUnits: number,
      occupiedUnits: number,
      vacantUnits: number,
      activeTenants: number,
      totalRentExpected: number, // SUM of rent_amount for occupied units
      totalPaymentsCollected: number, // SUM of payments with status='paid' for current month
      totalExpenses: number, // SUM of expenses for current month
      pendingInvoices: number, // COUNT of invoices with status != 'paid' for current month
      overduePayments: number, // COUNT of payments with status='overdue'
    }
    ```
  - All queries filter by `org_id`. Use the current month for financial aggregations.

### Step 9.2 — Create dashboard routes

- Create `backend/src/routes/dashboard.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/dashboard | requireAuth, requireOrgMember, requirePermission('buildings.read') | getDashboard |

- Single endpoint returns the full dashboard data object.

### Step 9.3 — Create reports service

- Create `backend/src/services/report.service.ts`:
  - `getMonthlyReport(orgId, month)` — `month` format `YYYY-MM`:
    ```ts
    {
      month: string,
      totalIncome: number,  // SUM of paid payments for month
      totalExpenses: number, // SUM of expenses for month
      netIncome: number,     // totalIncome - totalExpenses
      byCategory: Record<string, number>,  // expenses grouped by category
      byPaymentMethod: Record<string, number>,  // payments grouped by method
      outstandingDues: number, // SUM of payments with status='due' or 'overdue'
    }
    ```
  - `getPaymentStatusReport(orgId, month)` — per-unit payment status:
    ```ts
    {
      month: string,
      units: Array<{
        unitId: string,
        unitNumber: string,
        buildingName: string,
        tenantName: string | null,
        rentAmount: number,
        paidAmount: number,
        status: 'paid' | 'partial' | 'due' | 'overdue' | 'vacant'
      }>
    }
    ```

### Step 9.4 — Create report routes

- Create `backend/src/routes/reports.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/reports/monthly | requireAuth, requireOrgMember, requirePermission('payments.read') | getMonthlyReport |
| GET | /api/reports/payment-status | requireAuth, requireOrgMember, requirePermission('payments.read') | getPaymentStatusReport |

- Query params: `?month=2026-04` (defaults to current month if not provided).

### Step 9.5 — Create admin middleware

- Create `backend/src/middleware/admin.ts`:
  - `requireSuperAdmin` middleware:
    1. Check `req.user.is_super_admin === true`.
    2. If not → 403 "Super admin access required".
    3. If yes → `next()`.
  - This middleware is used in addition to `requireAuth` (does not need `requireOrgMember` — super admins can access any org).

### Step 9.6 — Create admin service

- Create `backend/src/services/admin.service.ts`:
  - `listAllOrgs(filters?)` — list all organizations with member count, building count. Support `is_active` filter.
  - `getOrgDetail(orgId)` — full org details with all related data (members, buildings, units count).
  - `updateOrg(orgId, data)` — update org name, plan, is_active.
  - `deactivateOrg(orgId)` — set `is_active = 0`.
  - `listAllUsers(filters?)` — list all users with their org memberships.
  - `getUserDetail(userId)` — user details with all org memberships and roles.
  - `updateUser(userId, data)` — update user name, email, is_super_admin flag.
  - `deactivateUser(userId)` — soft delete: set `is_active = 0` (requires adding `is_active` column to users table in a migration or handling it in auth check).
  - `getPlatformStats()` — return `{ totalOrgs, totalUsers, totalPaymentsRecorded, activeOrgs }`.

### Step 9.7 — Create admin routes

- Create `backend/src/routes/admin.ts`:

| Method | Path | Middleware | Handler |
|--------|------|-----------|---------|
| GET | /api/admin/orgs | requireAuth, requireSuperAdmin | listAllOrgs |
| GET | /api/admin/orgs/:id | requireAuth, requireSuperAdmin | getOrgDetail |
| PUT | /api/admin/orgs/:id | requireAuth, requireSuperAdmin | updateOrg |
| DELETE | /api/admin/orgs/:id | requireAuth, requireSuperAdmin | deactivateOrg |
| GET | /api/admin/users | requireAuth, requireSuperAdmin | listAllUsers |
| GET | /api/admin/users/:id | requireAuth, requireSuperAdmin | getUserDetail |
| PUT | /api/admin/users/:id | requireAuth, requireSuperAdmin | updateUser |
| DELETE | /api/admin/users/:id | requireAuth, requireSuperAdmin | deactivateUser |
| GET | /api/admin/stats | requireAuth, requireSuperAdmin | getPlatformStats |

### Step 9.8 — Add is_active column to users table

- Create `backend/src/db/migrations/006_add_user_is_active.sql`:
  ```sql
  ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;
  ```
- Update `requireAuth` middleware to check `is_active = 1` when fetching the user. If user is inactive → 401 "Account deactivated".

### Step 9.9 — Mount all new routes and verify

- In `backend/src/index.ts`:
  ```ts
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/admin', adminRoutes);
  ```
- Test:
  - `GET /api/dashboard` with `X-Org-Id` → aggregated stats.
  - `GET /api/reports/monthly?month=2026-04` → monthly income/expense summary.
  - `GET /api/reports/payment-status?month=2026-04` → per-unit payment status.
  - `GET /api/admin/stats` (super_admin only) → platform stats.
  - `GET /api/admin/orgs` (super_admin only) → all orgs.
  - `GET /api/admin/users` (super_admin only) → all users.
  - Non-super-admin accessing `/api/admin/*` → 403.

---

## Phase 10 — Frontend Integration

**Goal:** Wire the React frontend to use real backend API calls instead of mock data. Create the API client layer, update AuthContext, add org selection, and replace hardcoded data with API calls on each page.

### Step 10.1 — Create API client module

- Create `src/lib/api.ts` — a thin fetch wrapper:
  ```ts
  const API_BASE = '/api'; // proxied by Vite

  class ApiClient {
    private orgId: string | null = null;

    setOrgId(orgId: string | null) {
      this.orgId = orgId;
    }

    private async request(path: string, options: RequestInit = {}): Promise<Response> {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };
      if (this.orgId) {
        headers['X-Org-Id'] = this.orgId;
      }
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include', // send httpOnly cookies
      });
      if (response.status === 401) {
        // Attempt token refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          return this.request(path, options); // retry
        }
        throw new ApiError(401, 'Session expired');
      }
      if (response.status === 403) {
        toast.error('Permission denied');
      }
      return response;
    }

    async refreshToken(): Promise<boolean> { ... }
    async get(path: string): Promise<any> { ... }
    async post(path: string, body: any): Promise<any> { ... }
    async put(path: string, body: any): Promise<any> { ... }
    async del(path: string): Promise<any> { ... }
  }

  export const api = new ApiClient();
  ```
- Handles 401 → refresh token → retry automatically.
- Handles 403 → shows permission denied toast via `sonner`.
- Attaches `X-Org-Id` header on every request when org is selected.
- All cookies are sent via `credentials: 'include'`.

### Step 10.2 — Update AuthContext

- Modify `src/contexts/AuthContext.tsx`:
  - Replace mock `login` with `POST /api/auth/login` via `api.post('/auth/login', { phone, password })`.
  - Replace mock `register` with `POST /api/auth/register` via `api.post('/auth/register', { name, phone, password })`.
  - Add `googleLogin()` → redirect browser to `GET /api/auth/google`.
  - Replace mock `logout` with `POST /api/auth/logout`.
  - Add `refreshUser()` — `GET /api/auth/me` → updates user state and org list.
  - On app mount, call `refreshUser()` to restore session from httpOnly cookie.
  - Add `currentOrg` state — stored in `localStorage` as `rento_current_org`. On change, call `api.setOrgId()`.
  - Add `orgs` state — populated from `/api/auth/me` response.
  - Expose: `{ user, orgs, currentOrg, setCurrentOrg, login, register, logout, googleLogin, isLoading }`.

### Step 10.3 — Update Login page

- Modify `src/pages/Login.tsx`:
  - Add "Sign in with Google" button that calls `googleLogin()` (redirects to `/api/auth/google`).
  - Keep phone+password form, wire to `login(phone, password)`.
  - On successful login, redirect to `/` or the org selection if user has multiple orgs.

### Step 10.4 — Update Register page

- Modify `src/pages/Register.tsx`:
  - Wire form to `register(name, phone, password)`.
  - On successful registration, auto-login and redirect to org creation/onboarding.

### Step 10.5 — Add org selection component

- Create `src/components/OrgSelector.tsx`:
  - Dropdown that shows user's orgs from `AuthContext.orgs`.
  - On selection, sets `currentOrg` in AuthContext and `api.setOrgId()`.
  - Persist selection in `localStorage`.
  - If user has no org, show "Create Organization" button → navigates to org creation form.

### Step 10.6 — Add org creation flow

- Create `src/pages/CreateOrg.tsx` or add org creation as a dialog:
  - Form: `{ name: string }`.
  - Slug auto-generated from name (lowercase, hyphens).
  - On submit: `POST /api/orgs` → creates org, owner auto-joined as `property_manager`.
  - On success, set `currentOrg` and navigate to building management.

### Step 10.7 — Replace BuildingManagement mock data

- Modify `src/pages/BuildingManagement.tsx` (or its section components):
  - Replace hardcoded buildings with `GET /api/buildings` (filtered by `X-Org-Id`).
  - Replace hardcoded units with `GET /api/units?building_id=xxx`.
  - Replace hardcoded tenants with `GET /api/tenants`.
  - Replace hardcoded payments with `GET /api/payments`.
  - Replace hardcoded expenses with `GET /api/expenses`.
  - Add create/edit dialogs wired to POST/PUT endpoints.
  - Add delete confirmation dialogs wired to DELETE endpoints.
  - Use React Query (`useQuery`, `useMutation`) for data fetching with cache invalidation on mutations.

### Step 10.8 — Replace PropertyManagement mock data

- Modify `src/pages/PropertyManagement.tsx` similarly — multi-property view across all buildings in the org.
  - Aggregated dashboard data from `GET /api/dashboard`.
  - Financial summaries from `GET /api/reports/monthly`.

### Step 10.9 — Add admin page route

- Create `src/pages/Admin.tsx` (accessible only by `super_admin`):
  - Sidebar navigation: Organizations, Users, Stats.
  - `GET /api/admin/orgs` → list all orgs with toggle active/inactive.
  - `GET /api/admin/users` → list all users.
  - `GET /api/admin/stats` → platform stats cards.
- Add route in `src/App.tsx`: `<Route path="/admin" element={<Admin />} />`.
- Add link in navigation header (only visible for `super_admin`).

### Step 10.10 — Seed data for development

- Create `backend/src/db/seed.ts` (enhanced):
  - `seedDevData()` function that creates:
    - 1 super_admin user (phone: `01700000001`, password: `admin123`, name: "Super Admin")
    - 2 orgs: "Sunset Tower HOA", "Green Valley Apartments"
    - Buildings, units, tenants, flat owners, payments, expenses, invoices.
  - Called only when `NODE_ENV=development` and a flag is set (e.g., `SEED_DB=true` env var).
  - Add to startup: if `config.nodeEnv === 'development' && process.env.SEED_DB === 'true'` → run seed.

### Step 10.11 — Final integration testing

- Start both frontend and backend via `npm run dev`.
- Full E2E flow test:
  1. Register a new user → auto-login → redirect.
  2. Create an org → becomes `property_manager`.
  3. Create a building → see it in BuildingManagement.
  4. Add units to the building → see updated unit list.
  5. Add a tenant to a unit → tenant appears in tenant list.
  6. Record a payment → payment shows in payments.
  7. Create an invoice manually → print HTML invoice.
  8. Bulk generate invoices for a month → invoices created.
  9. View dashboard → aggregated stats.
  10. Switch org (if member of multiple) → data changes.
  11. Login as super_admin → access `/admin` → see all orgs and users.
  12. Logout → redirect to login page.

---

## Appendix A — File Tree (Final)

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── db/
│   │   ├── index.ts
│   │   ├── migrate.ts
│   │   ├── seed.ts
│   │   └── migrations/
│   │       ├── 001_init.sql
│   │       ├── 002_orgs.sql
│   │       ├── 003_properties.sql
│   │       ├── 004_financial.sql
│   │       ├── 005_invoices.sql
│   │       └── 006_add_user_is_active.sql
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rbac.ts
│   │   ├── orgScope.ts
│   │   ├── rateLimit.ts
│   │   ├── errorHandler.ts
│   │   └── admin.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── orgs.ts
│   │   ├── buildings.ts
│   │   ├── units.ts
│   │   ├── tenants.ts
│   │   ├── flatOwners.ts
│   │   ├── payments.ts
│   │   ├── expenses.ts
│   │   ├── accountPayables.ts
│   │   ├── invoices.ts
│   │   ├── roles.ts
│   │   ├── dashboard.ts
│   │   ├── reports.ts
│   │   └── admin.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── rbac.service.ts
│   │   ├── org.service.ts
│   │   ├── member.service.ts
│   │   ├── building.service.ts
│   │   ├── unit.service.ts
│   │   ├── tenant.service.ts
│   │   ├── flatOwner.service.ts
│   │   ├── payment.service.ts
│   │   ├── expense.service.ts
│   │   ├── accountPayable.service.ts
│   │   ├── invoice.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── report.service.ts
│   │   └── admin.service.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── org.schema.ts
│   │   ├── building.schema.ts
│   │   ├── unit.schema.ts
│   │   ├── tenant.schema.ts
│   │   ├── flatOwner.schema.ts
│   │   ├── payment.schema.ts
│   │   ├── expense.schema.ts
│   │   ├── invoice.schema.ts
│   │   └── role.schema.ts
│   ├── strategies/
│   │   ├── google.strategy.ts
│   │   └── local.strategy.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── utils/
│   │   └── jwt.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── .env
├── .env.example
└── .gitignore
```

## Appendix B — Migration Order

| # | File | Tables Created |
|---|------|---------------|
| 001 | `001_init.sql` | `users`, `refresh_tokens`, `account_links` |
| 002 | `002_orgs.sql` | `organizations`, `roles`, `role_permissions`, `org_members` |
| 003 | `003_properties.sql` | `buildings`, `units`, `flat_owners`, `tenants` |
| 004 | `004_financial.sql` | `payments`, `expenses`, `account_payables` |
| 005 | `005_invoices.sql` | `invoices`, `invoice_sequences` |
| 006 | `006_add_user_is_active.sql` | `ALTER TABLE users ADD COLUMN is_active` |

## Appendix C — API Route Summary

| Prefix | Auth | Org Scope | Permission |
|--------|------|-----------|------------|
| `/api/auth/*` | Varies | No | N/A |
| `/api/orgs/*` | Required | Varies | Varies |
| `/api/buildings/*` | Required | Required | Varies |
| `/api/units/*` | Required | Required | Varies |
| `/api/tenants/*` | Required | Required | Varies |
| `/api/flat-owners/*` | Required | Required | Varies |
| `/api/payments/*` | Required | Required | Varies |
| `/api/expenses/*` | Required | Required | Varies |
| `/api/account-payables/*` | Required | Required | Varies |
| `/api/invoices/*` | Required | Required | Varies |
| `/api/roles/*` | Required | Required | Varies |
| `/api/dashboard` | Required | Required | `buildings.read` |
| `/api/reports/*` | Required | Required | `payments.read` |
| `/api/admin/*` | Required | No | `super_admin` only |
| `/api/health` | None | No | N/A |