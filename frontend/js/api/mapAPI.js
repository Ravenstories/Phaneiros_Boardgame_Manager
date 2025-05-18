// frontend/js/api/mapAPI.js
/*
export async function fetchMapTiles(game_id) {
  const res = await fetch(`/api/tiles?game_id=${game_id}`);
  if (!res.ok) throw new Error(`Error fetching tiles: ${res.status}`);
  return res.json();
}
*/  

// Path-param style
export async function fetchMapTiles(game_id) {
  const r = await fetch(`/api/games/${game_id}/tiles`);
  return r;
}