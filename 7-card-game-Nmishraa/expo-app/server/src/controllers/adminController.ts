import { Response } from 'express';
import { pool } from '../db/database';
import { AuthRequest } from '../middleware/types';

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Game Master / Admin privileges required.' });
    return;
  }

  try {
    const userResult = await pool.query(
      'SELECT id, email, name, chips_balance AS "chipsBalance", is_vip AS "isVip", role, created_at AS "createdAt" FROM card_users'
    );
    const users = userResult.rows;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users.length,
        dailyNewUsers: users.length,
        activeUsers: { dau: users.length, wau: users.length, mau: users.length },
        totalLikes: 0,
        totalInstalls: users.length,
        mostLikedPlayers: users.slice(0, 5),
        engagementTrends: [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUsersList = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin privileges required.' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT id, email, name, chips_balance AS "chipsBalance", is_vip AS "isVip", role, created_at AS "createdAt" FROM card_users ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, count: result.rows.length, users: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const banUser = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin privileges required.' });
    return;
  }

  const { id } = req.params;
  try {
    const userResult = await pool.query('SELECT role, name FROM card_users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    if (userResult.rows[0].role === 'admin') {
      res.status(400).json({ success: false, error: 'Cannot ban another administrator.' });
      return;
    }

    await pool.query('DELETE FROM card_users WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: `Successfully banned and removed user ${userResult.rows[0].name}.` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLikeHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin privileges required.' });
    return;
  }

  res.status(200).json({ success: true, count: 0, likes: [] });
};
