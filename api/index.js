/**
 * Vercel serverless entry for the content + admin API.
 *
 * Every `/api/*` request is rewritten to this function (see vercel.json). The
 * Express app is created once per warm container; the Mongo connection and the
 * admin account are bootstrapped lazily on the first request and reused.
 */
import { createApp } from '../server/src/app.js';
import { connectDb } from '../server/src/config/db.js';
import { ensureAdmin } from '../server/src/seed/seed.js';

const app = createApp();

let boot = null;

async function ready() {
  if (!boot) {
    boot = (async () => {
      await connectDb();
      await ensureAdmin();
    })().catch((err) => {
      // don't cache a failed boot — let the next request retry a cold start
      boot = null;
      throw err;
    });
  }
  return boot;
}

export default async function handler(req, res) {
  try {
    await ready();
  } catch (err) {
    console.error('API boot failed:', err);
    res.statusCode = 503;
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify({
        error: {
          message: 'The kitchen is warming up — try again in a moment.',
          code: 'db_unavailable',
          detail: process.env.DEBUG_BOOT ? String(err && (err.stack || err.message || err)) : undefined,
        },
      }),
    );
    return;
  }
  return app(req, res);
}
