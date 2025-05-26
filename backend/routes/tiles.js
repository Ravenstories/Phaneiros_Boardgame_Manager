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

/* tilesRouter.get('/games/:game_id/tiles', async (req,res,next)=>{
  try{
    const tiles = await MapService.getTilesForGame(req.params.game_id);
    res.json(tiles);                       // <-- always array
  }catch(err){ next(err); }
}); */

tilesRouter.get('/api/games/:game_id/tiles', async (req, res, next) => {
  try {
    const tiles = await MapService.getTilesForGame(req.params.game_id);
    console.log('[tiles route] hit with', req.params.game_id);

    // cheap ETag = hash of updated_at max
    res.set('ETag', `"${createHash(tiles)}"`).json(tiles);
  } catch (e) { next(e); }
});
