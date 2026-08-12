import { Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database';
import { AuthRequest } from '../middleware/types';

const UpdateUserInput = z.object({
  name: z.string().min(2).optional(),
  chipsBalance: z.number().nonnegative().optional(),
});

export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const users = Array.from(db.users.values()).map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    chipsBalance: u.chipsBalance,
    isVip: u.isVip,
    createdAt: u.createdAt,
  }));
  res.status(200).json({ success: true, count: users.length, users });
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = db.users.get(id);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }
  res.status(200).json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, chipsBalance: user.chipsBalance, isVip: user.isVip, createdAt: user.createdAt },
  });
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const validated = UpdateUserInput.parse(req.body);

  const user = db.users.get(id);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  if (req.user?.id !== id && req.user?.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Not authorized to update this user' });
    return;
  }

  const updated = {
    ...user,
    name: validated.name ?? user.name,
    chipsBalance: validated.chipsBalance ?? user.chipsBalance,
  };

  db.users.set(id, updated);
  res.status(200).json({ success: true, user: { id: updated.id, email: updated.email, name: updated.name, chipsBalance: updated.chipsBalance, isVip: updated.isVip } });
};

export const upgradeVip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = db.users.get(id);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  if (req.user?.id !== id && req.user?.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Not authorized' });
    return;
  }

  const updated = { ...user, isVip: true };
  db.users.set(id, updated);
  res.status(200).json({ success: true, message: 'Successfully upgraded to VIP status', user: { id: updated.id, isVip: true } });
};
