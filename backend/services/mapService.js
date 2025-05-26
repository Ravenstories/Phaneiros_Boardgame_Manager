import { getAllTiles } from '../repositories/mapTileRepository.js'

/**
 * Return the tiles that belong to one game.
 * Add heavier rules here later (path‑finding, fog‑of‑war, etc.).
 */

export async function getTilesForGame(game_id) {
  return getAllTiles(game_id);            // let SQL do the filtering
}