// backend/routes/tiles.js
import express from 'express';
import { getTilesForGame } from '../services/mapService.js';   // import function

export const tilesRouter = express.Router();

// SINGLE canonical path
tilesRouter.get('/games/:game_id/tiles', async (req, res, next) => {
  try {
    console.log('[tiles route] hit', req.params.game_id);
    const tiles = await getTilesForGame(req.params.game_id);
    res.json(tiles);                            // always JSON
  } catch (err) { next(err); }
});
