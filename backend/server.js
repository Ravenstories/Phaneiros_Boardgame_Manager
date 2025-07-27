import express from 'express';
import path    from 'node:path';
import { fileURLToPath } from 'node:url';

import { tilesRouter }  from './routes/tiles.js';
import { gamesRouter }  from './routes/games.js';
import { usersRouter }  from './routes/users.js';

/* ── helpers ─────────────────────────────────────────────── */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR  = path.join(__dirname, '..', 'frontend');
const BOOTSTRAP_DIR = path.resolve('node_modules/bootstrap/dist');
const PORT = process.env.PORT || 3000;

/* ── build app ────────────────────────────────────────────── */
export const app = express();

/* API routes */
app.use('/api/games', gamesRouter);       // /api/games/…
app.use('/api',       tilesRouter);       // /api/games/:id/tiles
app.use('/api/users', usersRouter);       // /api/users/…

/* static assets */
app.use(express.static(FRONTEND_DIR));

/* local Bootstrap (CSS + JS only) */
app.use('/vendor/bootstrap', express.static(BOOTSTRAP_DIR, { index: false }));

/* SPA fallback */
app.get('*', (_req, res) =>
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'))
);

/* ── start server (skip when running tests) ──────────────── */
export const server =
  process.env.NODE_ENV === 'test'
    ? null
    : app.listen(PORT, () =>
        console.log(`Server listening on http://localhost:${PORT}`)
      );
