import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db/database';
import { AuthRequest } from './types';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-production-jwt-secret-key-7card';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Access token required in Authorization Bearer header' });
    return;
  }

  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (err || !decoded) {
      res.status(403).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    try {
      const payload = decoded as { id: string };
      const result = await pool.query(
        'SELECT id, email, name, chips_balance AS "chipsBalance", is_vip AS "isVip", role, created_at AS "createdAt" FROM card_users WHERE id = $1',
        [payload.id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ success: false, error: 'User associated with token not found' });
        return;
      }

      req.user = result.rows[0];
      next();
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin privilege required for this operation' });
    return;
  }
  next();
};
