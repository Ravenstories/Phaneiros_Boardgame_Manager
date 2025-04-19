import { getTilesForGame } from '../../mapService.js';

export default async function handler(req, res) {
  try {
    const gameId = req.query.gameId;
    const tiles  = await getTilesForGame(gameId);
    res.status(200).json(tiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
