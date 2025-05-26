// backend/server.js
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tilesRouter } from './routes/tiles.js';
import { gamesRouter } from './routes/games.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// API
app.use('/api/tiles', tilesRouter);
app.use('/api/games', gamesRouter);
app.use(express.static('frontend')); 

// Serve static front‑end
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Fallback for client‑side routing (optional)
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
