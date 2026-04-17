import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid Bangladesh phone format'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});