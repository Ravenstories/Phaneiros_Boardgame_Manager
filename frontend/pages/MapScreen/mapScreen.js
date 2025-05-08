/******************************************************************************
 * MapScreen – renders a draggable, point-top hex map inside #map-board
 ******************************************************************************/

import { fetchMapTiles } from '../../js/api/mapAPI.js';

/* CONFIG ------------------------------------------------------------------ */
const HEX_SIZE   = 50;
const HEX_GAP    = 4;
const HEX_HEIGHT = HEX_SIZE * Math.sqrt(3) / 2;
const COLORS = {
  plains   : '#b5d99c',
  forest   : '#6fbf73',
  mountain : '#9b9b9b',
  water    : '#6fa8dc',
  desert   : '#e8d28b',
  default  : '#dddddd',
};

/* DOM refs ---------------------------------------------------------------- */
const board = document.getElementById('map-board');   // new!
const info  = document.getElementById('tile-info');
if (!board) throw new Error('[MapScreen] #map-board not found');
board.style.position = 'relative';

/* Drag-to-pan ------------------------------------------------------------- */
let pan = { active:false, sx:0, sy:0, sl:0, st:0 };
board.addEventListener('mousedown', e => {
  if (e.button) return;
  pan = { active:true, sx:e.clientX, sy:e.clientY,
          sl:board.scrollLeft, st:board.scrollTop };
  board.style.cursor = 'grabbing';
});
window.addEventListener('mousemove', e => {
  if (!pan.active) return;
  board.scrollLeft = pan.sl - (e.clientX - pan.sx);
  board.scrollTop  = pan.st - (e.clientY - pan.sy);
});
window.addEventListener('mouseup', () => {
  pan.active = false;
  board.style.cursor = 'grab';
});

/* Boot -------------------------------------------------------------------- */
(async function init () {
  const gameId = new URLSearchParams(location.search).get('gameId')
             || localStorage.getItem('currentGameId');
  if (!gameId) return alert('No gameId set');

  const tiles = await fetchMapTiles(gameId).catch(err => {
    console.error(err); alert('Could not load map tiles'); return [];
  });
  renderMap(tiles);
})();

/* axial → pixel ----------------------------------------------------------- */
const toPixel = (q,r) => ({
  x:(HEX_SIZE+HEX_GAP)*(q+r/2),
  y:(HEX_HEIGHT+HEX_GAP)*r
});

/* Render ------------------------------------------------------------------ */
/* RENDER – place every tile inside #map-board so no negative coords. */
function renderMap (tiles) {
  board.textContent = '';                   // clear previous board
  const frag = document.createDocumentFragment();

  // 1) find bounding box in pixel space
  let minX = Infinity, minY = Infinity,
      maxX = -Infinity, maxY = -Infinity;

  for (const t of tiles) {
    const { x, y } = toPixel(t.x, t.y);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  // 2) shift so smallest hex lands at (0,0)
  const offsetX = -minX + HEX_GAP;          // add one gap for padding
  const offsetY = -minY + HEX_GAP;

  // 3) build hexes using the pre-computed offset
  for (const t of tiles) {
    const base = toPixel(t.x, t.y);
    frag.appendChild(buildHex(t, base.x + offsetX, base.y + offsetY));
  }

  // 4) resize #map-board so it fully contains the map
  const boardWidth  = maxX - minX + HEX_SIZE   + HEX_GAP * 2;
  const boardHeight = maxY - minY + HEX_HEIGHT + HEX_GAP * 2;
  board.style.width  = `${boardWidth}px`;
  board.style.height = `${boardHeight}px`;

  board.appendChild(frag);

  // ── 5. widen the surrounding card so nothing spills ──────────────
  const card = document.getElementById('page-content');
  if (card) card.style.width = `${boardWidth + 32}px`;   // + padding*2
}

/* Build one hex ----------------------------------------------------------- */
function buildHex(tile,px,py){
  const terrain = tile.terrain_type?.name || tile.terrain_name || 'plains';
  const div=document.createElement('div');
  div.className=`hex hex--${terrain}`;
  div.style.left=`${px}px`; div.style.top=`${py}px`;
  div.style.setProperty('--fill',COLORS[terrain]||COLORS.default);
  div.innerHTML=`<span>${tile.label}</span>`;
  div.addEventListener('click',()=>showInfo(tile,terrain));
  return div;
}

/* Info panel -------------------------------------------------------------- */
function showInfo(tile,terrain){
  if(!info) return;
  info.innerHTML=`
    <h4 style="margin:0 0 8px">${tile.label}</h4>
    <p><strong>Terrain:</strong> ${terrain}</p>
    <p><strong>Coords:</strong> ${tile.x}, ${tile.y}</p>`;
  info.style.display='block';
}
window.addEventListener('keydown',e=>{
  if(e.key==='Escape') info.style.display='none';
});

/* Alt reveals all labels */
window.addEventListener('keydown',e=>{
  if(e.altKey) board.classList.add('show-labels');
});
window.addEventListener('keyup',e=>{
  if(!e.altKey) board.classList.remove('show-labels');
});
