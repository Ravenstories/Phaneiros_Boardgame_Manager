import express from 'express';
import { GameService } from '../services/gameService.js';

export const gamesRouter = express.Router();

gamesRouter
  .get('/', async (_req, res) => {
    try {
      res.json(await GameService.list());
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  })
  .post('/', express.json(), async (req, res) => {
    try {
      const id = await GameService.create(req.body.game_type);
      res.status(201).json({ game_id: id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });
