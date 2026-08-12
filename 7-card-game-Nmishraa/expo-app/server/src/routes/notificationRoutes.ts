import { Router } from 'express';
import { dispatchPushNotification, registerWebhook } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/push', authenticateToken, dispatchPushNotification);
router.post('/webhook', authenticateToken, registerWebhook);

export default router;
