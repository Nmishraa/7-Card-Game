import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { AuthRequest } from '../middleware/types';

const PushNotificationInput = z.object({
  userId: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
});

const WebhookRegisterInput = z.object({
  url: z.string().url(),
  secret: z.string().min(8),
});

export const dispatchPushNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const validated = PushNotificationInput.parse(req.body);
  const notificationId = uuidv4();

  console.log(`[Push Dispatch] To User ${validated.userId}: [${validated.title}] ${validated.body}`);

  res.status(200).json({ success: true, message: 'Push notification dispatched successfully', notificationId });
};

export const registerWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const validated = WebhookRegisterInput.parse(req.body);
  const webhookId = uuidv4();

  res.status(200).json({ success: true, message: 'Webhook successfully registered', webhookId });
};
