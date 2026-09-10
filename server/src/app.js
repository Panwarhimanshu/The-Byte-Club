import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import { env } from './config/env.js';
import { attachUser } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';
import { api } from './routes/index.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: [env.clientUrl, 'http://localhost:5173', 'http://localhost:4173'],
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '512kb' }));
  app.use(cookieParser(env.cookieSecret));
  app.use(mongoSanitize());
  if (env.nodeEnv !== 'test') app.use(morgan('dev'));

  app.use(
    '/api',
    rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: { message: 'Too many requests — slow down a moment.', code: 'rate_limited' } },
    }),
  );

  app.get('/api/health', (_req, res) =>
    res.json({ data: { status: 'ok', uptime: process.uptime(), env: env.nodeEnv } }),
  );

  app.use('/api', attachUser, api);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
