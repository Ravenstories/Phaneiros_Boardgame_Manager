import { getAllTiles } from '../repositories/mapTileRepository.js'

/**
 * Return the tiles that belong to one game.
 * Add heavier rules here later (path‑finding, fog‑of‑war, etc.).
 */
export async function getTilesForGame(game_id) {
  const tiles = await getAllTiles();
  console.log('[getTilesForGame]:', game_id, tiles);
  return tiles.filter(t => t.game_id === game_id);
}
