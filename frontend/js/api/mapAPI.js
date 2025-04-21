// frontend/js/api/mapAPI.js
export async function fetchMapTiles(gameId) {
  const res = await fetch(`/api/tiles?gameId=${gameId}`);
  if (!res.ok) throw new Error(`Error fetching tiles: ${res.status}`);
  return res.json();
}
