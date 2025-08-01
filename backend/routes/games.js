/* backend/routes/games.js */
import express from 'express';
import { GameService } from '../services/gameService.js';
import * as logger from '../library/logger.js';
import { authenticate, requireRole, requireGameMaster } from '../middleware/auth.js';

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
    logger.error(err);
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
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ────────────────────────────────────────────────
   POST /api/games         →  create new game
   body: { "game_type": "kingdom" }
   ──────────────────────────────────────────────── */
gamesRouter.post('/', authenticate, express.json(), async (req, res) => {
  try {
    const id = await GameService.create(req.body.game_type, req.user.id);
    res.status(201).json({ game_id: id });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ────────────────────────────────────────────────
   DELETE /api/games/:game_id   → delete game
   ──────────────────────────────────────────────── */
gamesRouter.delete('/:game_id', authenticate, requireGameMaster('game_id'), async (req, res) => {
  try {
    await GameService.delete(req.params.game_id);
    res.status(204).end();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});