import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: '127.0.0.1',
  port: parseInt(process.env.TUNNEL_PORT || '54334', 10),
  user: process.env.DB_USER || 'neha_user',
  password: process.env.DB_PASSWORD || 'neha_password',
  database: process.env.DB_NAME || 'Neha_data',
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

// Initialize database schema tables if not exist in Neha_data
export async function initDb() {
  const client = await pool.connect();
  try {
    console.log(`[PostgreSQL] Connecting to database '${process.env.DB_NAME || 'Neha_data'}' on server 2.24.200.44...`);

    // Create 7 Card Game Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS card_users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT,
        name VARCHAR(255),
        chips_balance INT DEFAULT 1000,
        is_vip BOOLEAN DEFAULT false,
        role VARCHAR(50) DEFAULT 'player',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Card Game Rooms table
    await client.query(`
      CREATE TABLE IF NOT EXISTS card_rooms (
        id VARCHAR(255) PRIMARY KEY,
        host_id VARCHAR(255),
        game_state TEXT,
        max_players INT DEFAULT 4,
        current_players INT DEFAULT 1,
        status VARCHAR(50) DEFAULT 'waiting',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Game History table
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_history (
        id VARCHAR(255) PRIMARY KEY,
        room_id VARCHAR(255),
        winner_id VARCHAR(255),
        scores_json TEXT,
        ended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Chat Messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(255) PRIMARY KEY,
        room_id VARCHAR(255),
        sender_name VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Analytics Events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id VARCHAR(255) PRIMARY KEY,
        event_name VARCHAR(255) NOT NULL,
        payload TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default admin user in card_users
    await client.query(`
      INSERT INTO card_users (id, email, password_hash, name, chips_balance, is_vip, role)
      VALUES ('admin-uuid-1', 'admin@7card.game', '$2b$10$AdminSeededPasswordHashMock1234567890', 'System Admin', 1000000, true, 'admin')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('[PostgreSQL] 7 Card Game database tables verified/created successfully in Neha_data.');
  } catch (error: any) {
    console.error('[PostgreSQL] Database initialization error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}
