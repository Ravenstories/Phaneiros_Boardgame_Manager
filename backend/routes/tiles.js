// backend/routes/tiles.js
import express from 'express';
import { getTilesForGame } from '../services/mapService.js';

export const tilesRouter = express.Router();

/*
tilesRouter.get('/', async (req, res) => {
  try {
    const { game_id } = req.query;   // /api/tiles?game_id=...
    const tiles = await getTilesForGame(game_id);
    res.json(tiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
*/

tilesRouter.get('/games/:game_id/tiles', async (req, res) => {
  const id = req.params.game_id;           // MUST be .game_id (snake case)
  try {
    const tiles = await MapService.getTilesForGame(id);
    res.json(tiles);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});