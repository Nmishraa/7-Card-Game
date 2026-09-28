require('dotenv').config();
const http = require('http');
const app = require('./dist/app.js').default;
const { pool, initDb } = require('./dist/db/database.js');

const PREFERRED_PORT = parseInt(process.env.PORT || '8081', 10);
const FALLBACK_PORT = 5004;

async function start() {
  try {
    console.log('[Direct Remote DB] Connecting to local PostgreSQL database Neha_data on port 5432...');
    await initDb();
    const server = http.createServer(app);

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && server.address() === null && PREFERRED_PORT !== FALLBACK_PORT) {
        console.warn(`[7-Card-Game Backend] Port ${PREFERRED_PORT} is in use. Falling back to port ${FALLBACK_PORT}...`);
        server.listen(FALLBACK_PORT, () => {
          console.log(`[7-Card-Game Backend] Server running on http://localhost:${FALLBACK_PORT}`);
          console.log(`[Health Check] http://localhost:${FALLBACK_PORT}/health`);
        });
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });

    server.listen(PREFERRED_PORT, () => {
      console.log(`[7-Card-Game Backend] Server running on http://localhost:${PREFERRED_PORT}`);
      console.log(`[Health Check] http://localhost:${PREFERRED_PORT}/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
