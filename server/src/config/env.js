import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnv = resolve(__dirname, '../../../.env');
const serverEnv = resolve(__dirname, '../../.env');

dotenv.config({ path: existsSync(rootEnv) ? rootEnv : serverEnv });

const num = (v, fallback) => (v == null || v === '' ? fallback : Number(v));

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: num(process.env.PORT, 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  mongoUri: process.env.MONGO_URI || '',
  useMemoryDb: process.env.USE_MEMORY_DB === 'true' || !process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || process.env.JWT_SECRET || 'dev-cookie-secret',

  admin: {
    name: process.env.ADMIN_NAME || 'Byte Admin',
    email: (process.env.ADMIN_EMAIL || 'admin@thebyteclub.test').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'byteclub',
  },

  rateLimit: {
    windowMs: num(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: num(process.env.RATE_LIMIT_MAX, 600),
  },

  isProd: (process.env.NODE_ENV || 'development') === 'production',
};
