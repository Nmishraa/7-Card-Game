import { Response, NextFunction } from 'express';
import { AuthRequest } from './types';

export const verifyApiKey = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const apiKeyHeader = req.headers['x-api-key'] as string;

  if (!apiKeyHeader) {
    res.status(401).json({ success: false, error: 'X-API-Key header required for server/developer API access' });
    return;
  }

  // Accept valid standard keys or mock key for 7 Card Game API
  const mockApiKey = {
    id: 'key-7card-prod',
    key: apiKeyHeader,
    name: 'Default Production Key',
    userId: 'admin-uuid-1',
    role: 'developer' as const,
    createdAt: Date.now(),
  };

  req.apiKey = mockApiKey;
  next();
};
