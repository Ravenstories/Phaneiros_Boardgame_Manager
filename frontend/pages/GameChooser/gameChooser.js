/* ───────────────────────── Imports ───────────────────────── */
import {
  getGameId,
  setGameId,
  onChange
} from '../../services/gameStore.js';

import { renderCurrentGameStatus } from '../../ui/currentGameStatus.js';
import { gameRegistry } from '../../services/gameRegistry.js';

/* ───────────────────────── DOM References ───────────────────────── */
const tbody       = document.querySelector('#game-table tbody');
const emptyMsg    = document.getElementById('empty-msg');
const loadedTag   = document.getElementById('loaded-tag');
const refreshBtn  = document.getElementById('btn-refresh');

/* ───────────────────────── Init ───────────────────────── */
onChange(updateUI);
updateUI(getGameId());
loadGames();
refreshBtn.addEventListener('click', loadGames);

/* ───────────────────────── UI Update ───────────────────────── */
function updateUI(id) {
  const hasGame = Boolean(id);
  loadedTag.textContent = hasGame ? `Loaded: ${id}` : 'No game loaded.';
  
  highlightSelectedRow(id);
}

/* ───────────────────────── Network Actions ───────────────────────── */
async function loadGames() {
  spin(true);
  try {
    const res = await fetch('/api/games');
    const games = await res.json();
    renderGameList(games);
  } catch (error) {
    console.error('[loadGames] Failed:', error);
    alert('Could not load games.');
  } finally {
    spin(false);
  }
}

/* ───────────────────────── DOM Helpers ───────────────────────── */
function renderGameList(games) {
  tbody.innerHTML = '';

  if (!games.length) {
    emptyMsg.textContent = '— no games yet —';
    return;
  }

  emptyMsg.textContent = '';
  games.forEach(game => {
    const tr = document.createElement('tr');
    tr.dataset.id = game.game_id;
    const label = gameRegistry[game.game_type]?.label || game.game_type;
    const name  = game.game_name || `Game ${game.game_id}`;
    tr.innerHTML = `<td>${formatDate(game.created_at)}</td><td>${label}</td><td>${name}</td>`;
    tr.addEventListener('click', () => {
      setGameId(game.game_id);
      // Optionally load a component here
      // loadComponent('mapScreen');
    });
    tbody.appendChild(tr);
  });

  highlightSelectedRow(getGameId());
}

function highlightSelectedRow(selectedId) {
  [...tbody.children].forEach(tr => {
    tr.classList.toggle('active', tr.dataset.id === selectedId);
  });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}

/* ───────────────────────── UI Feedback ───────────────────────── */
function spin(isOn) {
  document.body.classList.toggle('loading', isOn);
}
