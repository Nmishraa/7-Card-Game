import { Router } from 'express';
import { createCheckoutSession, handlePaymentWebhook } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/checkout', authenticateToken, createCheckoutSession);
router.post('/webhook', handlePaymentWebhook);

export default router;
