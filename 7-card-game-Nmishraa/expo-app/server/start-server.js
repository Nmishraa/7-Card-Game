require('dotenv').config();
const http = require('http');
const app = require('./dist/app.js').default;
const { pool, initDb } = require('./dist/db/database.js');

const PORT = process.env.PORT || 5004;

async function start() {
  try {
    console.log('[Direct Remote DB] Connecting to local PostgreSQL database Neha_data on port ' + (process.env.DB_PORT || 5432) + '...');
    await initDb();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`[7-Card-Game Backend] Server running on http://localhost:${PORT}`);
      console.log(`[Health Check] http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
