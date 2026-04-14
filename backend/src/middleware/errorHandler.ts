import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }
  
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
}