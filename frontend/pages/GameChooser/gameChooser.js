/* ───────────────────────── Imports ───────────────────────── */
import {
  getGameId,
  setGameId,
  clearGameId,
  onChange
} from '../../services/gameStore.js';

import { renderCurrentGameStatus } from '../../ui/currentGameStatus.js';
import { gameRegistry } from '../../services/gameRegistry.js';

/* ───────────────────────── DOM References ───────────────────────── */
const tbody       = document.querySelector('#game-table tbody');
const emptyMsg    = document.getElementById('empty-msg');
const loadedTag   = document.getElementById('loaded-tag');
const newBtn      = document.getElementById('btn-new');
const refreshBtn  = document.getElementById('btn-refresh');
const deleteBtn   = document.getElementById('btn-delete');

/* ───────────────────────── Init ───────────────────────── */
onChange(updateUI);
updateUI(getGameId());
loadGames();

newBtn.addEventListener('click', handleCreateGame);
refreshBtn.addEventListener('click', loadGames);
deleteBtn.addEventListener('click', handleDeleteGame);

/* ───────────────────────── UI Update ───────────────────────── */
function updateUI(id) {
  const hasGame = Boolean(id);
  loadedTag.textContent = hasGame ? `Loaded: ${id}` : 'No game loaded.';
  deleteBtn.disabled = !hasGame;
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

async function handleCreateGame() {
  spin(true);
  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_type: 'kingdom' })
    });
    const { game_id } = await res.json();
    setGameId(game_id);
    await loadGames();
  } catch (error) {
    console.error('[handleCreateGame] Failed:', error);
    alert('Could not create game.');
  } finally {
    spin(false);
  }
}

async function handleDeleteGame() {
  const id = getGameId();
  if (!id || !confirm('Delete this game?')) return;

  spin(true);
  try {
    await fetch(`/api/games/${id}`, { method: 'DELETE' });
    clearGameId();
    await loadGames();
  } catch (error) {
    console.error('[handleDeleteGame] Failed:', error);
    alert('Could not delete game.');
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
