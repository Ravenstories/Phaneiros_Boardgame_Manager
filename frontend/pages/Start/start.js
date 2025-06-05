/* ───────────────────────── imports ───────────────────────── */
import {
  getGameId,    // read the current id
  setGameId,    // write the id + notify listeners
  onChange      // subscribe to changes
} from '../../js/gameStore.js';

import { renderCurrentGame } from '../../js/currentGameHeader.js';

/* ───────── DOM refs ──────── */
const tbody      = document.querySelector('#game-table tbody');
const emptyMsg   = document.getElementById('empty-msg');
const loadedTag  = document.getElementById('loaded-tag');
//const mapLink    = document.getElementById('map-link');
const newBtn     = document.getElementById('btn-new');
const refreshBtn = document.getElementById('btn-refresh');
const deleteBtn  = document.getElementById('btn-delete');

/* ───────── boot ─────────── */
onChange(updateUI);
updateUI(getGameId());
loadGames();

/* ───────── actions ──────── */
newBtn.onclick     = createGame;
refreshBtn.onclick = loadGames;
deleteBtn.onclick  = deleteCurrent;

/* ───────── UI state ─────── */
function updateUI(id){
  const enabled = !!id;
  loadedTag.textContent = enabled ? `Loaded: ${id}` : 'No game loaded.';
  /*
  mapLink.style.pointerEvents = enabled ? 'auto':'none';
  mapLink.tabIndex            = enabled ? '0':'-1';
  mapLink.style.opacity       = enabled ? '1':'.4';
  */
  deleteBtn.disabled          = !enabled;
  highlightRow(id);
}

/* ───────── network ──────── */
async function loadGames(){
  spin(true);
  try{
    const res   = await fetch('/api/games');
    const games = await res.json();
    renderRows(games);
  }catch(e){console.error(e); alert('Could not load games.');}
  finally{spin(false);}
}

async function createGame(){
  spin(true);
  try{
    const res = await fetch('/api/games',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({game_type:'kingdom'})
    });
    const {game_id} = await res.json();
    setGameId(game_id);
    await loadGames();
  }catch(e){console.error(e); alert('Could not create game.');}
  finally{spin(false);}
}

async function deleteCurrent(){
  const id = getGameId();
  if(!id || !confirm('Delete this game?')) return;
  spin(true);
  try{
    await fetch(`/api/games/${id}`,{method:'DELETE'});
    clearGameId();
    await loadGames();
  }catch(e){console.error(e); alert('Could not delete game.');}
  finally{spin(false);}
}

/* ───────── DOM helpers ───── */
function renderRows(games){
  tbody.innerHTML='';
  if(!games.length){
    emptyMsg.textContent='— no games yet —';
    return;
  }
  emptyMsg.textContent='';
  games.forEach(g=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${fmt(g.created_at)}</td><td>${g.game_type}</td>`;
    tr.dataset.id=g.game_id;
    tr.onclick=()=>setGameId(g.game_id);
    tbody.append(tr);
  });
  highlightRow(getGameId());
}

function highlightRow(id){
  Array.from(tbody.children).forEach(tr=>{
    tr.classList.toggle('active',tr.dataset.id===id);
  });
}

function fmt(iso){return new Date(iso).toLocaleDateString();}

/* ───────── spinner ───────── */
function spin(on){document.body.classList.toggle('loading',on);}