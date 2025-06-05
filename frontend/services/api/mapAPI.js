import { fetchJSON } from '../httpService.js';

export const fetchMapTiles = game_id => fetchJSON(`/api/games/${game_id}/tiles`);
