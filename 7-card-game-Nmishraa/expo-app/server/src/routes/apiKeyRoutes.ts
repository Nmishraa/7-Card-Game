import { Router } from 'express';
import { generateApiKey, listApiKeys, revokeApiKey } from '../controllers/apiKeyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, generateApiKey);
router.get('/', authenticateToken, listApiKeys);
router.delete('/:id', authenticateToken, revokeApiKey);

export default router;
