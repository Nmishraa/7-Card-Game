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

app.set('trust proxy', 1);

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
  const CANONICAL_ORIGIN = 'https://cards.gnanamai.com';

  // SEO 301 Permanent Redirect Map for legacy/duplicate alias URLs
  const redirects301: Record<string, string> = {
    '/rules': '/7-cards-least/rules',
    '/how-to-play': '/7-cards-least/how-to-play',
    '/strategy': '/7-cards-least/strategy',
    '/faq': '/7-cards-least/faq',
    '/variations': '/7-cards-least',
    '/7cards-least': '/7-cards-least',
    '/7cards-least-': '/7-cards-least',
    '/solo': '/play-against-ai',
    '/preview': '/demo'
  };

  app.use((req: Request, res: Response, next) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || req.path.startsWith('/api') || req.path === '/health') return next();
    
    const lowerPath = req.path.toLowerCase();
    const cleanSlashPath = (lowerPath.length > 1 && lowerPath.endsWith('/')) ? lowerPath.slice(0, -1) : lowerPath;

    // 1. Check direct 301 Permanent Redirects for legacy/duplicate alias paths (with or without trailing slash)
    if (redirects301[cleanSlashPath]) {
      return res.redirect(301, `${CANONICAL_ORIGIN}${redirects301[cleanSlashPath]}`);
    }

    // 2. Trailing slash 301 redirect to non-trailing slash (e.g. /7-cards-least/ -> 301 -> /7-cards-least)
    if (req.path.length > 1 && req.path.endsWith('/')) {
      const safePath = req.path.slice(0, -1);
      const query = req.url.slice(req.path.length);
      return res.redirect(301, `${CANONICAL_ORIGIN}${safePath}${query}`);
    }

    // 3. Serve pre-rendered static HTML file with 200 OK for canonical pages
    const cleanPath = req.path;
    if (cleanPath === '' || cleanPath === '/') {
      const rootHtmlPath = path.join(webDistPath, 'index.html');
      if (fs.existsSync(rootHtmlPath)) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Cache-Control', 'public, max-age=0');
        return res.sendFile(rootHtmlPath);
      }
    }

    const prerenderedPath = path.join(webDistPath, cleanPath, 'index.html');
    if (fs.existsSync(prerenderedPath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=0');
      return res.sendFile(prerenderedPath);
    }
    next();
  });

  app.use(express.static(webDistPath, {
    redirect: false,
    dotfiles: 'allow',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('robots.txt')) {
        res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
        res.setHeader('Cache-Control', 'public, max-age=3600');
      } else if (filePath.endsWith('sitemap.xml')) {
        res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    }
  }));
}

app.use('/api/v1', v1Router);

// SEO: Redirect /sitemap to /sitemap.xml
app.get('/sitemap', (req, res) => {
  res.redirect(301, '/sitemap.xml');
});

if (fs.existsSync(webDistPath)) {
  const validClientRoutes = new Set([
    '',
    '/',
    '/7-cards-least',
    '/7-cards-least/rules',
    '/7-cards-least/how-to-play',
    '/7-cards-least/strategy',
    '/7-cards-least/faq',
    '/multiplayer',
    '/play-against-ai',
    '/daily-challenge',
    '/strategy-lab',
    '/score-calculator',
    '/demo',
    '/privacy',
    '/about',
    '/contact'
  ]);

  app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();

    const cleanPath = req.path.replace(/\/$/, '') || '/';
    if (validClientRoutes.has(cleanPath)) {
      res.setHeader('Cache-Control', 'no-cache');
      const targetHtml = cleanPath === '/' 
        ? path.join(webDistPath, 'index.html') 
        : path.join(webDistPath, cleanPath, 'index.html');
      if (fs.existsSync(targetHtml)) {
        return res.sendFile(targetHtml);
      }
      return res.sendFile(path.join(webDistPath, 'index.html'));
    }

    // Truly unmapped route / non-existent asset -> Send 404 Not Found with noindex to prevent Soft 404 penalties
    res.status(404);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    const notFoundHtmlPath = path.join(webDistPath, '404.html');
    if (fs.existsSync(notFoundHtmlPath)) {
      return res.sendFile(notFoundHtmlPath);
    }
    return res.send(`<!DOCTYPE html><html><head><title>404 Not Found</title><meta name="robots" content="noindex, nofollow" /></head><body style="background:#062d12;color:#fff;text-align:center;padding:50px;"><h1>404 Not Found</h1><p>The page requested was not found.</p><a href="/" style="color:#38bdf8;">Return Home</a></body></html>`);
  });
}


app.use(errorHandler);

export default app;
