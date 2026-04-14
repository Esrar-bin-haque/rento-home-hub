import 'express';

interface AuthUser {
  userId: string;
  email?: string;
  phone?: string;
  is_super_admin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      org?: { id: string };
      orgMember?: { roleId: string };
    }
  }
}