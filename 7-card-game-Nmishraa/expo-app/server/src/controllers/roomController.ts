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

export const syncRoomState = async (req: AuthRequest, res: Response): Promise<void> => {
  const { room } = req.body;
  if (!room || !room.id) {
    res.status(400).json({ success: false, error: 'Invalid room payload' });
    return;
  }

  const roomId = room.id.toUpperCase();
  const gameStateStr = JSON.stringify(room);
  const status = room.status || 'lobby';
  const currentPlayers = room.players ? Object.keys(room.players).length : 1;
  const hostId = room.hostId || 'unknown';

  try {
    await pool.query(
      `INSERT INTO card_rooms (id, host_id, game_state, status, max_players, current_players, updated_at)
       VALUES ($1, $2, $3, $4, 8, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET
         game_state = EXCLUDED.game_state,
         status = EXCLUDED.status,
         current_players = EXCLUDED.current_players,
         updated_at = CURRENT_TIMESTAMP;`,
      [roomId, hostId, gameStateStr, status, currentPlayers]
    );

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, host_id AS "hostId", status, max_players AS "maxPlayers", current_players AS "currentPlayers", created_at AS "createdAt" FROM card_rooms ORDER BY updated_at DESC'
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
      'SELECT id, host_id AS "hostId", game_state AS "gameState", status, max_players AS "maxPlayers", current_players AS "currentPlayers", created_at AS "createdAt", updated_at AS "updatedAt" FROM card_rooms WHERE id = $1',
      [id.toUpperCase()]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Game room not found' });
      return;
    }

    const row = result.rows[0];
    let roomObj = null;
    if (row.gameState) {
      try { roomObj = JSON.parse(row.gameState); } catch (e) {}
    }

    res.status(200).json({ success: true, room: roomObj || row });
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
