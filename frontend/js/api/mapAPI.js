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
  console.log('[fetchMapTiles]:', game_id, r);
  if (!r.ok) throw new Error(`Error fetching tiles: ${r.status}`);
  return r.json();
}

/*
export const fetchMapTiles = game_id =>
  fetch(`/api/games/${game_id}/tiles`)
    .then(r=>{
      if(!r.ok) throw new Error(r.status);
      return r.json();               // always JSON array
    }
  );
*/