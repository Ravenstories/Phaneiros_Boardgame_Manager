import { getSession } from '../../services/api/userAPI.js';
import { getToken } from '../../services/userStore.js';
import { getGameId, setGameId } from '../../services/gameStore.js';

let userId, token, userRole;
let modal, typeSelect, typeInput, nameInput;

export default async function init() {
  const newBtn = document.getElementById('gm-new');
  const refreshBtn = document.getElementById('gm-refresh');
  const msgEl = document.getElementById('gm-msg');

  // Modal elements
  const modalEl = document.getElementById('gm-modal');
  modal = new window.bootstrap.Modal(modalEl);
  typeSelect = document.getElementById('gm-type-select');
  typeInput = document.getElementById('gm-type-new');
  nameInput = document.getElementById('gm-name');
  const form = document.getElementById('gm-form');

  newBtn.addEventListener('click', async () => {
    await loadGameTypes();
    typeInput.value = '';
    nameInput.value = '';
    modal.show();
  });
  refreshBtn.addEventListener('click', loadGames);
  form.addEventListener('submit', handleCreateGame);

  try {
    const user = await getSession();
    userId = user.id;
    userRole = user.role;
    token = getToken();
    await loadGames();
  } catch (err) {
    msgEl.textContent = 'Failed to load games';
    console.error(err);
  }
}

async function loadGames() {
  const listEl = document.getElementById('gm-games');
  const msgEl = document.getElementById('gm-msg');
  listEl.innerHTML = '';
  msgEl.textContent = '';
  try {
    const endpoint =
      userRole === 'Admin'
        ? '/api/games'
        : `/api/users/${userId}/games`;
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`${res.status}: ${err.error || res.statusText}`);
    }
    let games;
    if (userRole === 'Admin') {
      games = await res.json();
    } else {
      const assignments = await res.json();
      games = assignments.filter(g => g.role === 'Game Master');
    }
    if (!games.length) {
      msgEl.textContent = 'No managed games.';
      return;
    }
    for (const g of games) {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `<div>${g.game_name ? g.game_name : 'Game'} ${g.game_id}</div>`;
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-sm btn-danger ms-2';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => handleDeleteGame(g.game_id));
      li.appendChild(delBtn);
      listEl.appendChild(li);
      try {
        const usersRes = await fetch(`/api/games/${g.game_id}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (usersRes.ok) {
          const players = await usersRes.json();
          const ul = document.createElement('ul');
          ul.className = 'mt-2 mb-0';
          players.forEach(p => {
            const pi = document.createElement('li');
            pi.textContent = `User ${p.user_id} - ${p.role}`;
            ul.appendChild(pi);
          });
          li.appendChild(ul);
        }
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    msgEl.textContent = `Failed to load games: ${err.message}`;
    console.error(err);
  }
}

async function handleCreateGame(e) {
  e.preventDefault();
  const chosen = typeSelect.value;
  const custom = typeInput.value.trim();
  const gameType = custom || chosen;
  const gameName = nameInput.value.trim();
  if (!gameType || !gameName) return;
  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ game_type: gameType, game_name: gameName })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`${res.status}: ${err.error || res.statusText}`);
    }
    const { game_id } = await res.json();
    setGameId(game_id);
    modal.hide();
    await loadGames();
    await loadGameTypes();
  } catch (err) {
    console.error(err);
  }
}

async function loadGameTypes() {
  try {
    const res = await fetch('/api/games/types', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load types');
    const types = await res.json();
    typeSelect.innerHTML = '<option value="">-- choose type --</option>';
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      typeSelect.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
  }
}

async function handleDeleteGame(id) {
  if (!confirm('Delete this game?')) return;
  try {
    await fetch(`/api/games/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (String(id) === getGameId()) setGameId(null);
    await loadGames();
  } catch (err) {
    console.error(err);
  }
}