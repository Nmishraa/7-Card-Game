import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database';
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

  const tx = {
    id: transactionId,
    userId: req.user.id,
    amount: validated.amount,
    currency: 'USD',
    status: 'pending' as const,
    itemId: validated.itemId,
    createdAt: Date.now(),
  };

  db.transactions.set(transactionId, tx);

  res.status(200).json({
    success: true,
    sessionId,
    checkoutUrl: `https://checkout.stripe.mock/pay/${sessionId}?tx=${transactionId}`,
  });
};

export const handlePaymentWebhook = async (req: Request, res: Response): Promise<void> => {
  const event = req.body;

  console.log('[Stripe Webhook Received]:', event.type);

  if (event.type === 'checkout.session.completed') {
    const txId = event.data?.object?.metadata?.transactionId;
    const tx = txId ? db.transactions.get(txId) : null;

    if (tx) {
      tx.status = 'completed';
      db.transactions.set(txId, tx);

      const user = db.users.get(tx.userId);
      if (user) {
        if (tx.itemId === 'bundle_1000_chips') user.chipsBalance += 1000;
        else if (tx.itemId === 'bundle_5000_chips') user.chipsBalance += 5000;
        else if (tx.itemId === 'vip_subscription_monthly') user.isVip = true;

        db.users.set(user.id, user);
      }
    }
  }

  res.status(200).json({ received: true });
};
