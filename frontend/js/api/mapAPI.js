import { fetchJSON } from '../http.js';

export const fetchMapTiles = game_id => fetchJSON(`/api/games/${game_id}/tiles`);
