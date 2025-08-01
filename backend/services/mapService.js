import { getAllTiles } from '../repositories/mapTileRepository.js';

const cache = new Map();
const TTL = 10000; // 10 seconds

/**
 * Return the tiles that belong to one game.
 * Add heavier rules here later (path‑finding, fog‑of‑war, etc.).
 */

export async function getTilesForGame(game_id) {
  const cached = cache.get(game_id);
  if (cached && Date.now() - cached.timestamp < TTL) {
    return cached.tiles;
  }
  const tiles = await getAllTiles(game_id); // let SQL do the filtering
  cache.set(game_id, { tiles, timestamp: Date.now() });
  return tiles;
}