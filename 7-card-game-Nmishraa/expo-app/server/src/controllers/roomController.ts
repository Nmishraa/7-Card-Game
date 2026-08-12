import { Response } from 'express';
import { z } from 'zod';
import { pool } from '../db/database';
import { AuthRequest } from '../middleware/types';

const CreateRoomInput = z.object({
  maxRounds: z.number().min(1).max(10).default(5),
});

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  try {
    const validated = CreateRoomInput.parse(req.body);
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();

    const result = await pool.query(
      `INSERT INTO card_rooms (id, host_id, status, max_players, current_players)
       VALUES ($1, $2, 'lobby', 4, 1)
       RETURNING id, host_id AS "hostId", status, max_players AS "maxPlayers", current_players AS "currentPlayers", created_at AS "createdAt";`,
      [roomId, req.user.id]
    );

    res.status(201).json({ success: true, room: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, host_id AS "hostId", status, max_players AS "maxPlayers", current_players AS "currentPlayers", created_at AS "createdAt" FROM card_rooms ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, count: result.rows.length, rooms: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, host_id AS "hostId", status, max_players AS "maxPlayers", current_players AS "currentPlayers", created_at AS "createdAt" FROM card_rooms WHERE id = $1',
      [id.toUpperCase()]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Game room not found' });
      return;
    }

    res.status(200).json({ success: true, room: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const { id } = req.params;
  try {
    const roomResult = await pool.query('SELECT host_id FROM card_rooms WHERE id = $1', [id.toUpperCase()]);
    if (roomResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Room not found' });
      return;
    }

    const hostId = roomResult.rows[0].host_id;
    if (hostId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Not authorized to delete room' });
      return;
    }

    await pool.query('DELETE FROM card_rooms WHERE id = $1', [id.toUpperCase()]);
    res.status(200).json({ success: true, message: `Room ${id} successfully closed` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
