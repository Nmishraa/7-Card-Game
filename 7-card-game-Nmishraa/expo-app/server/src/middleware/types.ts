import { Request } from 'express';
import { User, ApiKey } from '../db/schema';

export interface AuthRequest extends Request {
  user?: User;
  apiKey?: ApiKey;
}
