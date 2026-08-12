import { Response, NextFunction } from 'express';
import { db } from '../db/database';
import { AuthRequest } from './types';

export const verifyApiKey = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const apiKeyHeader = req.headers['x-api-key'] as string;

  if (!apiKeyHeader) {
    res.status(401).json({ success: false, error: 'X-API-Key header required for server/developer API access' });
    return;
  }

  let validKey = null;
  for (const [, k] of db.apiKeys) {
    if (k.key === apiKeyHeader) {
      validKey = k;
      break;
    }
  }

  if (!validKey) {
    res.status(403).json({ success: false, error: 'Invalid or revoked API Key' });
    return;
  }

  req.apiKey = validKey;
  next();
};
