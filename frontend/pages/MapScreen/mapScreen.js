/******************************************************************************
 * MapScreen – renders a point‑top hex map using axial coords in x / y.
 ******************************************************************************/

import { fetchMapTiles } from '../../js/api/mapAPI.js';

/* ───────────── CONFIG ───────────── */
const HEX_SIZE   = 50;                 // px – tip‑to‑tip width
const HEX_GAP    = 4;                  // px – gap between hexes
const HEX_HEIGHT = HEX_SIZE * Math.sqrt(3) / 2;   // point‑top height

const TERRAIN_COLORS = {
  plains   : '#b5d99c',
  forest   : '#6fbf73',
  mountain : '#9b9b9b',
  water    : '#6fa8dc',
  desert   : '#e8d28b',
  default  : '#dddddd',
};

/* ───── DOM GUARD ───── */
const container = document.getElementById('map-container');
if (!container) throw new Error('[MapScreen] <div id="map-container"> missing');
container.style.position = 'relative';

/* ───── BOOTSTRAP ───── */
(async function init () {
  const gameId = getCurrentGameId();
  if (!gameId) { alert('No gameId in URL/localStorage'); return; }

  try {
    const tiles = await fetchMapTiles(gameId);
    renderMap(tiles);
  } catch (err) {
    console.error(err);
    alert('Could not load map tiles. Check console for details.');
  }
})();

/* ───── HELPERS ───── */
function getCurrentGameId () {
  const urlId = new URLSearchParams(window.location.search).get('gameId');
  return urlId || localStorage.getItem('currentGameId');
}

/** axial → pixel (point‑top) */
function axialToPixel (q, r) {
  const x = (HEX_SIZE + HEX_GAP) * (q + r / 2);
  const y = (HEX_HEIGHT + HEX_GAP) * r;
  return { x, y };
}

/* ───── RENDER ───── */
function renderMap (tiles) {
  console.log('renderMap', tiles);
  container.textContent = '';            // clear old map
  const frag = document.createDocumentFragment();

  let minX = Infinity, minY = Infinity,
      maxX = -Infinity, maxY = -Infinity;

  for (const t of tiles) {
    const q = t.x;
    const r = t.y;
    const { x, y } = axialToPixel(q, r);

    // friendly terrain string (depends on how you joined it in the API)
    const terrain = t.terrain_type?.name || t.terrain_name || 'plains';

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    frag.appendChild(buildHex(t, x, y, terrain));
  }

  // offset so smallest hex lands at (0,0)
  const offsetX = -minX + HEX_GAP;
  const offsetY = -minY + HEX_GAP;
  for (const el of frag.children) {
    el.style.left = `${+el.dataset.x + offsetX}px`;
    el.style.top  = `${+el.dataset.y + offsetY}px`;
  }

  container.style.width  = `${maxX - minX + HEX_SIZE   + HEX_GAP * 2}px`;
  container.style.height = `${maxY - minY + HEX_HEIGHT + HEX_GAP * 2}px`;

  container.appendChild(frag);
}

/* build one <div class="hex"> */
function buildHex (tile, pixelX, pixelY, terrain) {
  const div = document.createElement('div');
  div.className = `hex hex--${terrain}`;
  div.textContent = tile.label || '';
  div.style.cssText = `
    position:absolute;
    width:${HEX_SIZE}px;
    height:${HEX_HEIGHT}px;
    background:${TERRAIN_COLORS[terrain] || TERRAIN_COLORS.default};
    clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0 75%,0 25%);
  `;
  div.dataset.x = pixelX;
  div.dataset.y = pixelY;

  div.addEventListener('click', () => {
    alert(`Territory: ${tile.label}\nTerrain: ${terrain}\nAxial: ${tile.x}, ${tile.y}`);
  });
  return div;
}

/* expose util for tests */
export const _internal = { axialToPixel };
