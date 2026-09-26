import { Router } from 'express';
import { trackEvent, getAnalyticsSummary } from '../controllers/analyticsController';

const router = Router();

// Accept both /events and /track endpoints for analytics tracking
router.post('/events', trackEvent);
router.post('/track', trackEvent);
router.get('/summary', getAnalyticsSummary);

export default router;
