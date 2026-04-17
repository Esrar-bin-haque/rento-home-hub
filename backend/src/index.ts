import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import './config/passport.js';
import { initDatabase, saveDatabase } from './db/index.js';
import { runMigrations } from './db/migrate.js';
import { seedDefaultRoles } from './db/seed.js';
import { seedDemoData } from './db/seed-demo.js';
import authRoutes from './routes/auth.js';
import orgRoutes from './routes/orgs.js';
import buildingRoutes from './routes/buildings.js';
import unitRoutes from './routes/units.js';
import tenantRoutes from './routes/tenants.js';
import paymentRoutes from './routes/payments.js';
import expenseRoutes from './routes/expenses.js';
import payableRoutes from './routes/payables.js';
import invoiceRoutes from './routes/invoices.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import { errorHandler } from './middleware/errorHandler.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many attempts, please try again later' },
});

const app = express();

app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

app.use(helmet());

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/payables', payableRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.use(errorHandler);

await initDatabase();
await runMigrations();
console.log('Database migrations complete');
seedDefaultRoles();
try {
  await seedDemoData();
} catch (e) {
  console.log('Demo data seed skipped or error:', e.message);
}

setInterval(() => {
  saveDatabase();
  console.log('Database saved');
}, 30000);

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});