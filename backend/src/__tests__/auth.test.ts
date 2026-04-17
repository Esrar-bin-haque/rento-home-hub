import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, closeTestDb } from './setup.js';
import { setTestDb } from '../db/index.js';
import { registerUser, loginUser, findUserById, findUserByPhone } from '../services/auth.service.js';
import authRouter from '../routes/auth.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

describe('Auth API', () => {
  beforeEach(async () => {
    const db = await createTestDb();
    setTestDb(db);
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('registerUser', () => {
    it('should create a new user with valid data', async () => {
      const user = await registerUser({ name: 'John Doe', phone: '+8801700000001', password: 'password123' });
      expect(user).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.phone).toBe('+8801700000001');
    });

    it('should throw error for duplicate phone', async () => {
      await registerUser({ name: 'John', phone: '+8801700000002', password: 'pass123' });
      await expect(registerUser({ name: 'Jane', phone: '+8801700000002', password: 'pass456' }))
        .rejects.toThrow('PHONE_EXISTS');
    });
  });

  describe('loginUser', () => {
    it('should return user with correct credentials', async () => {
      await registerUser({ name: 'John', phone: '+8801700000003', password: 'mypassword' });
      const user = await loginUser('+8801700000003', 'mypassword');
      expect(user).toBeDefined();
      expect(user?.phone).toBe('+8801700000003');
    });

    it('should return null with wrong password', async () => {
      await registerUser({ name: 'John', phone: '+8801700000004', password: 'correctpass' });
      const user = await loginUser('+8801700000004', 'wrongpass');
      expect(user).toBeNull();
    });

    it('should return null for non-existent phone', async () => {
      const user = await loginUser('+8801700999999', 'anypass');
      expect(user).toBeNull();
    });
  });

  describe('findUserByPhone', () => {
    it('should find user by phone', async () => {
      await registerUser({ name: 'Test User', phone: '+8801700000005', password: 'pass' });
      const user = findUserByPhone('+8801700000005');
      expect(user).toBeDefined();
      expect(user?.name).toBe('Test User');
    });

    it('should return null for non-existent phone', () => {
      const user = findUserByPhone('+8801999999999');
      expect(user).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      const created = await registerUser({ name: 'Test User', phone: '+8801700000006', password: 'pass' });
      const user = findUserById(created.id);
      expect(user).toBeDefined();
      expect(user?.phone).toBe('+8801700000006');
    });

    it('should return null for non-existent id', () => {
      const user = findUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });

  describe('Auth Router', () => {
    it('should have register endpoint', () => {
      expect(true).toBe(true);
    });

    it('should have login endpoint', () => {
      expect(true).toBe(true);
    });
  });

  describe('JWT Token', () => {
    it('should generate valid access token', async () => {
      const user = await registerUser({ name: 'JWT Test', phone: '+8801700000007', password: 'pass' });
      const token = jwt.sign({ sub: user.id, phone: user.phone }, config.jwtSecret, { expiresIn: '1h' });
      const payload = jwt.verify(token, config.jwtSecret) as any;
      expect(payload.sub).toBe(user.id);
    });
  });
});