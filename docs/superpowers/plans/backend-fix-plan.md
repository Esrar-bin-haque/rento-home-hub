# Rento Backend — Bug Fix Plan

> Based on code review findings. Execute fixes in order.

## Fix 1 — CRITICAL: Auth Routes

**1.1** ackend/src/routes/auth.ts line 27 — Add missing wait:
\\\	s
const user = await registerUser(data);
\\\

**1.2** ackend/src/routes/auth.ts line 103 — Add missing eturn:
\\\	s
if (!userId) {
  res.clearCookie(REFRESH_TOKEN_COOKIE);
  return res.status(401).json({ error: 'Invalid or expired token' });
}
\\\

## Fix 2 — CRITICAL: Invoice Service

**2.1** ackend/src/services/invoice.service.ts — Fix column/placeholder mismatch:
- Change 11 ? placeholders to 10 (remove one)

**2.2** ackend/src/services/invoice.service.ts — Fix markInvoiceAsPaid:
\\\	s
run('UPDATE invoices SET status = ?, paid_at = ? WHERE id = ? AND org_id = ?',
  ['paid', new Date().toISOString(), id, orgId]);
\\\

## Fix 3 — CRITICAL: Frontend Auth

**3.1** src/pages/Login.tsx — Make handleSubmit async, await login before navigate

**3.2** src/pages/Register.tsx — Call register with 3 args (name, phone, password), not 4

**3.3** src/contexts/AuthContext.tsx — Fix logout: use try/finally to clear state after API call

## Fix 4 — HIGH: Auth Service Race Condition

**4.1** ackend/src/services/auth.service.ts — Catch SQLite UNIQUE constraint error instead of pre-check

## Fix 5 — HIGH: Route try/catch

**5.1** All route files — Wrap POST/PUT/DELETE handlers in try/catch, return actual data not {ok:true}

## Fix 6 — HIGH: HTML Injection

**6.1** ackend/src/routes/invoices.ts — Add escapeHtml() helper and sanitize all user data in print endpoint

## Fix 7 — MEDIUM: Tenant Transactions

**7.1** ackend/src/db/index.ts — Add transaction() helper
**7.2** ackend/src/services/tenant.service.ts — Wrap createTenant in transaction
**7.3** ackend/src/services/tenant.service.ts — Check for other tenants before setting unit to vacant

## Fix 8 — MEDIUM: Foreign Key Validation

**8.1** All service files — Validate foreign keys belong to org before insert

## Fix 9 — MEDIUM: Invoice Number Race

**9.1** ackend/src/services/invoice.service.ts — Wrap generateInvoiceNumber in transaction

## Fix 10-12 — LOW

**10** org.service.ts — Use is_system=1 to find property_manager role
**11** seed.ts — Wrap role seeding in transaction
**12** Routes — Return null from delete service, handle 404 in route
