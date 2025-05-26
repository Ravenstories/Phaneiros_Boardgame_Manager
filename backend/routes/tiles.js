// backend/routes/tiles.js
import express from 'express';
import { getTilesForGame } from '../services/mapService.js';

export const tilesRouter = express.Router();

/*
tilesRouter.get('/games/:game_id/tiles', async (req, res) => {
  const id = req.params.game_id;           // MUST be .game_id (snake case)
  console.log('[getAllTiles]:', id);
  try {
    const tiles = await MapService.getTilesForGame(id);
    res.json(tiles);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});*/

tilesRouter.get('/games/:game_id/tiles', async (req,res,next)=>{
  try{
    const tiles = await MapService.getTilesForGame(req.params.game_id);
    res.json(tiles);                       // <-- always array
  }catch(err){ next(err); }
});