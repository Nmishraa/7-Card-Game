import { Router } from 'express';
import { listUsers, getUserById, updateUser, upgradeVip } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, listUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.post('/:id/vip', authenticateToken, upgradeVip);

export default router;
