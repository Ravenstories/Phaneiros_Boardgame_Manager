/* backend/routes/games.js */
import express from 'express';
import { GameService } from '../services/gameService.js';

export const gamesRouter = express.Router();

/* ────────────────────────────────────────────────
   GET /api/games/:game_id   →  one game row
   ──────────────────────────────────────────────── */
gamesRouter.get('/:game_id(\\d+)', async (req, res) => {
  try {
    const id   = Number(req.params.game_id);
    const game = await GameService.get(id);   // ← we add this in GameService
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ────────────────────────────────────────────────
   GET /api/games          →  list all games
   ──────────────────────────────────────────────── */
gamesRouter.get('/', async (_req, res) => {
  try {
    res.json(await GameService.list());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ────────────────────────────────────────────────
   POST /api/games         →  create new game
   body: { "game_type": "kingdom" }
   ──────────────────────────────────────────────── */
gamesRouter.post('/', express.json(), async (req, res) => {
  try {
    const id = await GameService.create(req.body.game_type);
    res.status(201).json({ game_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
