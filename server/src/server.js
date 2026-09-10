import { createApp } from './app.js';
import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { ensureSeeded, ensureAdmin } from './seed/seed.js';

async function start() {
  await connectDb();

  if (env.nodeEnv !== 'production') {
    // dev: seed menu content if empty, always keep the admin account in sync
    await ensureSeeded();
  } else {
    // prod: don't touch content, but make sure an admin can sign in
    await ensureAdmin();
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`\n▸ The Byte Club content API → http://localhost:${env.port}/api`);
    console.log(`▸ Health                    → http://localhost:${env.port}/api/health\n`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
