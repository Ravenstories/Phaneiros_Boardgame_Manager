   import { fetchMapTiles } from '../../js/api/mapAPI.js';

   /* ========== CONFIG ==========
      Tweak these to fit design
      --------------------------- */
   const HEX_SIZE        = 50;          // px, width tip‑to‑tip
   const HEX_GAP         = 4;           // px, gap between hexes
   const TERRAIN_COLORS  = {            // fallback demo palette
     plains:  '#b5d99c',
     forest:  '#6fbf73',
     mountain:'#9b9b9b',
     water:   '#6fa8dc',
     desert:  '#e8d28b',
     default: '#ddd'
   };
   
   /* ========== DOM ========== */
   const container = document.getElementById('map-container'); // <div> in mapScreen.html
   if (!container) {
     throw new Error(
       `[mapScreen] Missing <div id="map-container"> in mapScreen.html`
     );
   }
   
   /* ========== LOAD & RENDER ========== */
   (async function init() {
     const gameId = getCurrentGameId();
     if (!gameId) {
       alert('No gameId found in URL or localStorage');
       return;
     }
   
     try {
       const tiles = await fetchMapTiles(gameId);
       renderMap(tiles);
     } catch (err) {
       /* eslint-disable-next-line no-console */
       console.error(err);
       alert('Could not load map tiles. Check console for details.');
     }
   })();
   
   /* ---------------------------------- */
   function getCurrentGameId() {
     const urlParam = new URLSearchParams(window.location.search).get('gameId');
     return urlParam || localStorage.getItem('currentGameId');
   }
   
   /* ---------------------------------- */
   function renderMap(tiles) {
     container.innerHTML = '';                     // clear old content
     tiles.forEach(tile => container.append(hexForTile(tile)));
   
     // Resize container bounds so scrollbars fit map size
     const { maxQ, maxR } = tiles.reduce(
       (acc, t) => ({
         maxQ: Math.max(acc.maxQ, t.q ?? 0),
         maxR: Math.max(acc.maxR, t.r ?? 0)
       }),
       { maxQ: 0, maxR: 0 }
     );
   
     const width  = (HEX_SIZE + HEX_GAP) * (maxQ + 2);
     const height = (HEX_SIZE * 0.75 + HEX_GAP) * (maxR + 3);
     container.style.width  = `${width}px`;
     container.style.height = `${height}px`;
   }
   
   /* ---------------------------------- */
   function hexForTile(tile) {
     /* Expected fields coming from /api/tiles:
          tile.territory_id  – uuid
          tile.label         – "E3", "Winterfell", etc.
          tile.q / tile.r    – axial coords   (add in DB or compute client‑side)
          tile.terrain_name  – join with terrain_type if you like
     */
     const { q = 0, r = 0, label, terrain_name } = tile;
   
     // axial‑to‑pixel   (point‑top orientation)
     const x = (HEX_SIZE + HEX_GAP) * (q + r / 2);
     const y = (HEX_SIZE * 0.75 + HEX_GAP) * r;
   
     // build DOM
     const div = document.createElement('div');
     div.className = 'hex';
     div.textContent = label ?? '';          // show label in centre
     div.style.background =
       TERRAIN_COLORS[terrain_name] ?? TERRAIN_COLORS.default;
     div.style.width  = `${HEX_SIZE}px`;
     div.style.height = `${HEX_SIZE}px`;
     div.style.left   = `${x}px`;
     div.style.top    = `${y}px`;
   
     // click‑for‑details (stub)
     div.addEventListener('click', () => {
       alert(
         `Territory: ${label}\n` +
         `Terrain:   ${terrain_name ?? 'unknown'}\n` +
         `Coords:    q=${q}, r=${r}`
       );
     });
   
     return div;
   }
   