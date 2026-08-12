import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/storageController';
import { authenticateToken } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);

export default router;
