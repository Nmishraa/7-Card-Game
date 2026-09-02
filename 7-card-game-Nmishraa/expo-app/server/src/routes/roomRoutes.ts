import { Router } from 'express';
import { createRoom, listRooms, getRoom, deleteRoom, syncRoomState } from '../controllers/roomController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createRoom);
router.post('/sync', syncRoomState);
router.get('/', listRooms);
router.get('/:id', getRoom);
router.delete('/:id', authenticateToken, deleteRoom);

export default router;
