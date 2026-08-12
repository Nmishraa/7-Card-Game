import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database';
import { AuthRequest } from '../middleware/types';

const CreateApiKeyInput = z.object({
  name: z.string().min(2),
});

export const generateApiKey = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const validated = CreateApiKeyInput.parse(req.body);
  const keyId = uuidv4();
  const rawKey = `7card_live_${uuidv4().replace(/-/g, '')}`;

  const apiKeyObj = {
    id: keyId,
    key: rawKey,
    name: validated.name,
    userId: req.user.id,
    createdAt: Date.now(),
  };

  db.apiKeys.set(keyId, apiKeyObj);

  res.status(201).json({
    success: true,
    apiKey: apiKeyObj,
  });
};

export const listApiKeys = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const keys = Array.from(db.apiKeys.values())
    .filter(k => k.userId === req.user?.id)
    .map(k => ({ id: k.id, name: k.name, createdAt: k.createdAt, keyPreview: `${k.key.substring(0, 15)}...` }));

  res.status(200).json({ success: true, count: keys.length, apiKeys: keys });
};

export const revokeApiKey = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const { id } = req.params;
  const apiKey = db.apiKeys.get(id);

  if (!apiKey || (apiKey.userId !== req.user.id && req.user.role !== 'admin')) {
    res.status(404).json({ success: false, error: 'API key not found or not authorized' });
    return;
  }

  db.apiKeys.delete(id);
  res.status(200).json({ success: true, message: 'API key successfully revoked' });
};
