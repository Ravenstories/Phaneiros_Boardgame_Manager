/***************************************************************************
 * MapScreen – draws a draggable, point-top hex map inside #map-board
 * -------------------------------------------------------------------------
 * ❶  Exports `init(boardElement)` so it can be mounted manually if desired.
 * ❷  Immediately finds #map-board and calls init() for normal page use.
 * ❸  Guards every DOM handle, so it never throws on missing elements.
 ***************************************************************************/

import { fetchMapTiles }            from '../../services/api/mapAPI.js';
import { getGameId, onChange }      from '../../services/gameStore.js';

/* ── config -------------------------------------------------------------- */
const HEX_SIZE = 60;
const GAP      = 4;
const HEX_H    = HEX_SIZE * Math.sqrt(3) / 2;
const COLORS   = {
  plains  : '#b5d99c', forest : '#6fbf73', mountain: '#9b9b9b',
  water   : '#6fa8dc', desert : '#e8d28b', default : '#dddddd'
};

/* ── public API (called by loader or self-boot) -------------------------- */
export default async function init({ target }) {
  //console.log('[MapScreen] init() called');
  const board = target.querySelector('#map-board');
  if (!board || board.dataset.initialised) return;
  board.style.position = 'relative';

  const info = document.getElementById('tile-info');    // may be null

  /* drag-to-pan --------------------------------------------------------- */
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
    pan.active = false; board.style.cursor = 'grab';
  });

  /* boot --------------------------------------------------------------- */
  await drawMap(getGameId());
  onChange(drawMap);                                     // react to game switch

  /* ── helpers inside init --------------------------------------------- */
  async function drawMap(gameId) {
    info?.style.setProperty('display','none');
    if (!gameId) { board.innerHTML = '<p class="map-msg">No game selected.</p>'; return; }

    setLoading(true);
    try {
      const tiles = await fetchMapTiles(gameId);
      render(tiles);
    } catch (e) {
      console.error(e);
      board.innerHTML = '<p class="map-msg">Could not load tiles.</p>';
    } finally { setLoading(false); }
  }

  function render(tiles) {
    board.textContent = '';
    if (!tiles.length) {
      board.innerHTML = '<p class="map-msg">Empty map.</p>'; return;
    }

    /* convert axial → pixel, compute bounds ---------------------------- */
    const toPx = (q,r)=>({ x:(HEX_SIZE+GAP)*(q+r/2), y:(HEX_H+GAP)*r });
    let minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9;
    for (const t of tiles) {
      const {x,y}=toPx(t.x,t.y);
      minX=Math.min(minX,x); minY=Math.min(minY,y);
      maxX=Math.max(maxX,x); maxY=Math.max(maxY,y);
    }
    const offX=-minX+GAP, offY=-minY+GAP;

    /* build hex DOM ---------------------------------------------------- */
    const frag=document.createDocumentFragment();
    for (const t of tiles) {
      const {x,y}=toPx(t.x,t.y);
      frag.append(buildHex(t,x+offX,y+offY));
    }
    board.style.width  = `${maxX-minX + HEX_SIZE + GAP*2}px`;
    board.style.height = `${maxY-minY + HEX_H   + GAP*2}px`;
    board.append(frag);
  }

  function buildHex(tile,px,py){
    const terrain = tile.terrain_type?.name || tile.terrain_name || 'plains';
    const div=document.createElement('div');
    div.className=`hex hex--${terrain}`;
    div.style.left=`${px}px`; div.style.top=`${py}px`;
    div.style.setProperty('--fill', COLORS[terrain]||COLORS.default);
    div.innerHTML=`<span>${tile.label}</span>`;
    div.onclick = ()=>showInfo(tile,terrain);
    return div;
  }

  function showInfo(tile,terrain){
    if(!info) return;
    info.innerHTML = `
      <h4 style="margin:0 0 8px">${tile.label}</h4>
      <p><strong>Terrain:</strong> ${terrain}</p>
      <p><strong>Coords:</strong> ${tile.x}, ${tile.y}</p>`;
    info.style.display='block';
  }

  function setLoading(on){ board.classList.toggle('loading',on); }
}

/* ── self-boot when imported -------------------------------------------- 
const boardEl = document.getElementById('map-board');
init(boardEl);
*/
