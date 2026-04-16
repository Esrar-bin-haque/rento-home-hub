import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid Bangladesh phone format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  phone: z.string(),
  password: z.string(),
});