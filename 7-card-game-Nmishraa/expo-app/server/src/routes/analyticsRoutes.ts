import { Router } from 'express';
import { trackEvent, getAnalyticsSummary } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';
import { verifyApiKey } from '../middleware/apiKey';

const router = Router();

router.post('/events', verifyApiKey, trackEvent);
router.get('/summary', authenticateToken, getAnalyticsSummary);

export default router;
