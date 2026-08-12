import express, { Application, Request, Response } from 'express';
import { apiRateLimiter, corsMiddleware, securityHeaders } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import apiKeyRoutes from './routes/apiKeyRoutes';
import roomRoutes from './routes/roomRoutes';
import storageRoutes from './routes/storageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';

const app: Application = express();

app.use(securityHeaders);
app.use(corsMiddleware);
app.use(apiRateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

import { pool } from './db/database';

app.get('/health', async (req: Request, res: Response) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'connected',
      ssh_host: process.env.SSH_HOST || '2.24.200.44',
      database: process.env.DB_NAME || 'Neha_data',
      db_timestamp: dbResult.rows[0].now,
      uptime: process.uptime(),
      timestamp: Date.now()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      database: process.env.DB_NAME || 'Neha_data'
    });
  }
});

const v1Router = express.Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/api-keys', apiKeyRoutes);
v1Router.use('/rooms', roomRoutes);
v1Router.use('/storage', storageRoutes);
v1Router.use('/notifications', notificationRoutes);
v1Router.use('/analytics', analyticsRoutes);
v1Router.use('/payments', paymentRoutes);
v1Router.use('/admin', adminRoutes);

import path from 'path';
import fs from 'fs';

const webDistPath = path.join(__dirname, '../../dist');
if (fs.existsSync(webDistPath)) {
  app.use(express.static(webDistPath));
}

app.use('/api/v1', v1Router);

if (fs.existsSync(webDistPath)) {
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    res.sendFile(path.join(webDistPath, 'index.html'));
  });
}

app.use(errorHandler);

export default app;
