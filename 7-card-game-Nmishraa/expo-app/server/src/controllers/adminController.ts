import { Response } from 'express';
import { db } from '../db/database';
import { AuthRequest } from '../middleware/types';

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Game Master / Admin privileges required.' });
    return;
  }

  const users = Array.from(db.users.values());
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;
  const monthMs = 30 * dayMs;

  let dailyNewUsers = 0;
  let dau = 0;
  let wau = 0;
  let mau = 0;
  let totalLikes = 0;

  users.forEach((u) => {
    if (now - u.createdAt <= dayMs) dailyNewUsers++;
    dau++;
    wau++;
    mau++;
    totalLikes += 0;
  });

  const totalInstalls = users.length;

  res.status(200).json({
    success: true,
    stats: {
      totalUsers: users.length,
      dailyNewUsers,
      activeUsers: { dau, wau, mau },
      totalLikes,
      totalInstalls,
      mostLikedPlayers: users.slice(0, 5).map(u => ({ id: u.id, name: u.name, email: u.email })),
      engagementTrends: [],
    },
  });
};

export const getUsersList = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin privileges required.' });
    return;
  }

  const { search, filter } = req.query;
  let users = Array.from(db.users.values());

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  if (filter === 'vip') {
    users = users.filter(u => u.isVip);
  } else if (filter === 'admin') {
    users = users.filter(u => u.role === 'admin');
  }

  res.status(200).json({ success: true, count: users.length, users });
};

export const banUser = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin privileges required.' });
    return;
  }

  const { id } = req.params;
  const user = db.users.get(id);

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found.' });
    return;
  }

  if (user.role === 'admin') {
    res.status(400).json({ success: false, error: 'Cannot ban another administrator.' });
    return;
  }

  // Extend user object in map or delete
  db.users.delete(id);

  res.status(200).json({ success: true, message: `Successfully banned and removed user ${user.name}.` });
};

export const getLikeHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin privileges required.' });
    return;
  }

  const likes: any[] = [];
  res.status(200).json({ success: true, count: likes.length, likes });
};
