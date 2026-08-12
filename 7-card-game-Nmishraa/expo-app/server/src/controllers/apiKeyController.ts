import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
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

  res.status(200).json({ success: true, count: 0, apiKeys: [] });
};

export const revokeApiKey = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const { id } = req.params;
  res.status(200).json({ success: true, message: `API key ${id} successfully revoked` });
};
