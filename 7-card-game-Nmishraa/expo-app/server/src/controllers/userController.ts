import { Response } from 'express';
import { z } from 'zod';
import { pool } from '../db/database';
import { AuthRequest } from '../middleware/types';

const UpdateUserInput = z.object({
  name: z.string().min(2).optional(),
  chipsBalance: z.number().nonnegative().optional(),
});

export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, chips_balance AS "chipsBalance", is_vip AS "isVip", role, created_at AS "createdAt" FROM card_users ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, count: result.rows.length, users: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, email, name, chips_balance AS "chipsBalance", is_vip AS "isVip", role, created_at AS "createdAt" FROM card_users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const validated = UpdateUserInput.parse(req.body);

    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Not authorized to update this user' });
      return;
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (validated.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(validated.name);
    }
    if (validated.chipsBalance !== undefined) {
      updates.push(`chips_balance = $${paramIndex++}`);
      values.push(validated.chipsBalance);
    }

    if (updates.length === 0) {
      res.status(400).json({ success: false, error: 'No fields to update' });
      return;
    }

    values.push(id);
    const query = `UPDATE card_users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, name, chips_balance AS "chipsBalance", is_vip AS "isVip";`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const upgradeVip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Not authorized' });
      return;
    }

    const result = await pool.query(
      'UPDATE card_users SET is_vip = true WHERE id = $1 RETURNING id, is_vip AS "isVip"',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Successfully upgraded to VIP status', user: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
