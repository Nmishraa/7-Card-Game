import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/database';
import { AuthRequest } from './types';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-production-jwt-secret-key-7card';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Access token required in Authorization Bearer header' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err || !decoded) {
      res.status(403).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    const payload = decoded as { id: string };
    const user = db.users.get(payload.id);

    if (!user) {
      res.status(404).json({ success: false, error: 'User associated with token not found' });
      return;
    }

    req.user = user;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin privilege required for this operation' });
    return;
  }
  next();
};
