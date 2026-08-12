import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { AuthRequest } from '../middleware/types';

const CreateCheckoutInput = z.object({
  itemId: z.string(),
  amount: z.number().positive(),
});

export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const validated = CreateCheckoutInput.parse(req.body);
  const sessionId = `cs_test_${uuidv4().replace(/-/g, '')}`;
  const transactionId = uuidv4();

  res.status(200).json({
    success: true,
    sessionId,
    checkoutUrl: `https://checkout.stripe.mock/pay/${sessionId}?tx=${transactionId}`,
  });
};

export const handlePaymentWebhook = async (req: Request, res: Response): Promise<void> => {
  const event = req.body;
  console.log('[Stripe Webhook Received]:', event.type);
  res.status(200).json({ received: true });
};
