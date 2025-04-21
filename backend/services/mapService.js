import { getAllTiles } from '../repositories/mapTileRepository.js'

/**
 * Return the tiles that belong to one game.
 * Add heavier rules here later (path‑finding, fog‑of‑war, etc.).
 */
export async function getTilesForGame(gameId) {
  const tiles = await getAllTiles();
  return tiles.filter(t => t.game_id === gameId);
}
