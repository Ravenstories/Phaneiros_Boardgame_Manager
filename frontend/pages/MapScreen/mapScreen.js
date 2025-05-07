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
function renderMap(tiles){
  board.textContent='';
  const frag=document.createDocumentFragment();
  let maxX=0,maxY=0;

  for(const t of tiles){
    const {x,y}=toPixel(t.x,t.y);
    maxX=Math.max(maxX,x); maxY=Math.max(maxY,y);
    frag.appendChild(buildHex(t,x,y));
  }
  board.style.width = `${maxX+HEX_SIZE+HEX_GAP*2}px`;
  board.style.height= `${maxY+HEX_HEIGHT+HEX_GAP*2}px`;
  board.appendChild(frag);
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




/******************************************************************************
 * MapScreen – renders a draggable, point-top hex map using axial coords (x/y)
 * and shows a side-info panel on click. Matches mapStyles.css rules.
 ******************************************************************************/
/*
import { fetchMapTiles } from '../../js/api/mapAPI.js';

/* ───────────── CONFIG ───────────── 
const HEX_SIZE   = 50;                         // px – width tip-to-tip
const HEX_GAP    = 4;                          // px – gap between hexes
const HEX_HEIGHT = HEX_SIZE * Math.sqrt(3) / 2.9;/* px – height of point-top 
const COLORS = {                               // fallback palette
  plains   : '#b5d99c',
  forest   : '#6fbf73',
  mountain : '#9b9b9b',
  water    : '#6fa8dc',
  desert   : '#e8d28b',
  default  : '#dddddd',
};

/* ───── DOM GUARD ───── 
const container = document.getElementById('map-container');
if (!container) throw new Error('[MapScreen] missing <div id="map-container">');
container.style.position = 'relative';         // anchor for abs-pos children

const infoPanel = document.getElementById('tile-info');

/* ───── Drag-to-pan ───── 
let isPanning = false, panStartX = 0, panStartY = 0, startScrollX = 0, startScrollY = 0;
container.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  isPanning = true;
  container.style.cursor = 'grabbing';
  panStartX = e.clientX;
  panStartY = e.clientY;
  startScrollX = container.scrollLeft;
  startScrollY = container.scrollTop;
});
window.addEventListener('mousemove', e => {
  if (!isPanning) return;
  container.scrollLeft = startScrollX - (e.clientX - panStartX);
  container.scrollTop  = startScrollY - (e.clientY - panStartY);
});
window.addEventListener('mouseup', () => {
  isPanning = false;
  container.style.cursor = 'grab';
});

/* ───── BOOTSTRAP ───── 
(async function init () {
  const gameId = getGameId();
  if (!gameId) { alert('No gameId in URL/localStorage'); return; }

  try {
    const tiles = await fetchMapTiles(gameId);
    renderMap(tiles);
  } catch (err) {
    console.error(err);
    alert('Could not load map tiles. Check console for details.');
  }
})();

/* ───── HELPERS ───── 
function getGameId () {
  return new URLSearchParams(window.location.search).get('gameId')
      || localStorage.getItem('currentGameId');
}

/** axial → pixel (point-top) 
function axialToPixel (q, r) {
  return {
    x: (HEX_SIZE + HEX_GAP) * (q + r / 2),
    y: (HEX_HEIGHT + HEX_GAP) * r,
  };
}

/* ───── RENDER ───── 
function renderMap (tiles) {
  container.textContent = '';
  const frag = document.createDocumentFragment();

  let maxX = 0, maxY = 0;

  for (const t of tiles) {
    const { x, y } = axialToPixel(t.x, t.y);
    const terrain = t.terrain_type?.name || t.terrain_name || 'plains';

    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    frag.appendChild(buildHex(t, x, y, terrain));
  }

  /* container size = max coord + one hex + padding 
  container.style.width  = `${maxX + HEX_SIZE + HEX_GAP * 2}px`;
  container.style.height = `${maxY + HEX_HEIGHT + HEX_GAP * 2}px`;

  container.appendChild(frag);
}

/* build one <div class="hex"> 
function buildHex (tile, px, py, terrain) {
  const div = document.createElement('div');
  div.className = `hex hex--${terrain}`;
  div.style.cssText = `
    left:${px}px;
    top:${py}px;
    background:${COLORS[terrain] || COLORS.default};
  `;

  /* label span (makes it hide/reveal via CSS) 
  div.innerHTML = `<span>${tile.label}</span>`;

  /* click → side panel 
  div.addEventListener('click', () => showTileInfo(tile, terrain));
  return div;
}

/* ───── Info panel ───── 
function showTileInfo (tile, terrain) {
  if (!infoPanel) return;
  infoPanel.innerHTML = `
    <h4 style="margin:0 0 8px">${tile.label}</h4>
    <p><strong>Terrain:</strong> ${terrain}</p>
    <p><strong>Coords:</strong> ${tile.x}, ${tile.y}</p>
  `;
  infoPanel.style.display = 'block';
}

/* hide info panel on ESC 
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') infoPanel.style.display = 'none';
});

/* ───── Alt = show all labels ───── 
window.addEventListener('keydown', e => {
  if (e.altKey) container.classList.add('show-labels');
});
window.addEventListener('keyup', e => {
  if (!e.altKey) container.classList.remove('show-labels');
});

/* expose util for unit tests 
export const _internal = { axialToPixel };
*/