// src/api/mapAPI.js   (running in the browser)
export async function fetchMapTiles(gameId) {
  const res = await fetch(`/api/tiles?gameId=${gameId}`);
  if (!res.ok) throw new Error(`Error fetching tiles: ${res.status}`);
  return res.json();
}
