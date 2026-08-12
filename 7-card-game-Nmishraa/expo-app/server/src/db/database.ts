import { User, ApiKey, Room, StorageFile, Notification, Webhook, AnalyticsEvent, PaymentTransaction } from './schema';

class Database {
  public users: Map<string, User> = new Map();
  public apiKeys: Map<string, ApiKey> = new Map();
  public rooms: Map<string, Room> = new Map();
  public files: Map<string, StorageFile> = new Map();
  public notifications: Map<string, Notification> = new Map();
  public webhooks: Map<string, Webhook> = new Map();
  public analyticsEvents: Map<string, AnalyticsEvent> = new Map();
  public transactions: Map<string, PaymentTransaction> = new Map();

  constructor() {
    // Seed an initial admin user
    this.users.set('admin-uuid-1', {
      id: 'admin-uuid-1',
      email: 'admin@7card.game',
      passwordHash: '$2b$10$AdminSeededPasswordHashMock1234567890',
      name: 'System Admin',
      chipsBalance: 1000000,
      isVip: true,
      role: 'admin',
      createdAt: Date.now(),
    });
  }
}

export const db = new Database();
