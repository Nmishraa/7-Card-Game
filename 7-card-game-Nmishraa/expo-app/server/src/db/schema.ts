import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  name: z.string().min(2),
  chipsBalance: z.number().nonnegative().default(1000),
  isVip: z.boolean().default(false),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.number().default(() => Date.now()),
});

export type User = z.infer<typeof UserSchema>;

export const ApiKeySchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.number().default(() => Date.now()),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;

export const RoomSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  status: z.enum(['lobby', 'playing', 'game-over']),
  maxRounds: z.number().default(5),
  currentRound: z.number().default(1),
  createdAt: z.number().default(() => Date.now()),
});

export type Room = z.infer<typeof RoomSchema>;

export const StorageFileSchema = z.object({
  id: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string().url(),
  uploadedBy: z.string(),
  createdAt: z.number().default(() => Date.now()),
});

export type StorageFile = z.infer<typeof StorageFileSchema>;

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  isRead: z.boolean().default(false),
  createdAt: z.number().default(() => Date.now()),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const WebhookSchema = z.object({
  id: z.string(),
  userId: z.string(),
  url: z.string().url(),
  secret: z.string(),
  createdAt: z.number().default(() => Date.now()),
});

export type Webhook = z.infer<typeof WebhookSchema>;

export const AnalyticsEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  eventType: z.string(),
  timestamp: z.number().default(() => Date.now()),
  metadata: z.record(z.any()).optional(),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

export const PaymentTransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  currency: z.string().default('USD'),
  status: z.enum(['pending', 'completed', 'failed']),
  itemId: z.string(),
  createdAt: z.number().default(() => Date.now()),
});

export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>;
