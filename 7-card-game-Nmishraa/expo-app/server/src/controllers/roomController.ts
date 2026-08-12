import { Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database';
import { AuthRequest } from '../middleware/types';

const CreateRoomInput = z.object({
  maxRounds: z.number().min(1).max(10).default(5),
});

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const validated = CreateRoomInput.parse(req.body);
  const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();

  const newRoom = {
    id: roomId,
    hostId: req.user.id,
    status: 'lobby' as const,
    maxRounds: validated.maxRounds,
    currentRound: 1,
    createdAt: Date.now(),
  };

  db.rooms.set(roomId, newRoom);

  res.status(201).json({ success: true, room: newRoom });
};

export const listRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  const rooms = Array.from(db.rooms.values());
  res.status(200).json({ success: true, count: rooms.length, rooms });
};

export const getRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const room = db.rooms.get(id.toUpperCase());

  if (!room) {
    res.status(404).json({ success: false, error: 'Game room not found' });
    return;
  }

  res.status(200).json({ success: true, room });
};

export const deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const { id } = req.params;
  const room = db.rooms.get(id.toUpperCase());

  if (!room || (room.hostId !== req.user.id && req.user.role !== 'admin')) {
    res.status(404).json({ success: false, error: 'Room not found or not authorized' });
    return;
  }

  db.rooms.delete(id.toUpperCase());
  res.status(200).json({ success: true, message: `Room ${id} successfully closed` });
};
