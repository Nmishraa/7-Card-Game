import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { AuthRequest } from '../middleware/types';

export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required for storage upload' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ success: false, error: 'No file provided in multipart/form-data upload' });
    return;
  }

  const fileId = uuidv4();
  const folder = req.body.folder || 'general';
  const cdnUrl = `https://cdn.7card.game/${folder}/${fileId}_${req.file.originalname}`;

  const storageFile = {
    id: fileId,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url: cdnUrl,
    uploadedBy: req.user.id,
    createdAt: Date.now(),
  };

  db.files.set(fileId, storageFile);

  res.status(200).json({
    success: true,
    fileId,
    url: cdnUrl,
    size: req.file.size,
  });
};
