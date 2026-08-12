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

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
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

app.use('/api/v1', v1Router);

app.use(errorHandler);

export default app;
