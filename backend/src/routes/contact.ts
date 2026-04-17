import { Router, Request, Response } from 'express';
import { contactSchema } from '../schemas/contact.schema.js';
import { ZodError } from 'zod';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = contactSchema.parse(req.body);

    console.log('Contact form submission:', data);

    res.json({ ok: true });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.errors });
    }
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Failed to process contact form' });
  }
});

export default router;