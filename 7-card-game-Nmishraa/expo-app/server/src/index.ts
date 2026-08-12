import 'firebase-functions/logger/compat';
import http from 'http';
import { onRequest } from 'firebase-functions/v2/https';
import app from './app';

const PORT = process.env.PORT || 5000;

export const api = onRequest({ cors: true, maxInstances: 10 }, app);

if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`[Server] Production Backend API listening on http://localhost:${PORT}`);
    console.log(`[Health Check] http://localhost:${PORT}/health`);
    console.log(`[API Base] http://localhost:${PORT}/api/v1`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`[Shutdown] Received ${signal}. Closing server gracefully...`);
    server.close(() => {
      console.log('[Shutdown] Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}
