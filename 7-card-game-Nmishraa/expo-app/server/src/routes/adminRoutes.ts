import { Router } from 'express';
import { getAdminStats, getUsersList, banUser, getLikeHistory } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateToken, getAdminStats);
router.get('/users', authenticateToken, getUsersList);
router.delete('/users/:id/ban', authenticateToken, banUser);
router.get('/likes', authenticateToken, getLikeHistory);

export default router;
