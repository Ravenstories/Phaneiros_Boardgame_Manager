// backend/routes/tiles.js
import express from 'express';
import { getTilesForGame } from '../services/mapService.js';

export const tilesRouter = express.Router();

tilesRouter.get('/', async (req, res) => {
  try {
    const { gameId } = req.query;   // /api/tiles?gameId=...
    const tiles = await getTilesForGame(gameId);
    res.json(tiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
