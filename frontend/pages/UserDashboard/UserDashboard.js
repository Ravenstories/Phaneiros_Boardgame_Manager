import { getSession, updateUser } from '../../services/api/userAPI.js';
import { gameRegistry } from '../../services/gameRegistry.js';

export default async function init() {
  const form = document.getElementById('user-form');
  const msgEl = document.getElementById('user-msg');
  const gamesListEl = document.getElementById('games-list');
  const gamesEmptyEl = document.getElementById('games-empty');

  try {
    var user = await getSession();
    if (user && user.email) {
      fillForm(user);
    } else {
      msgEl.textContent = 'Not logged in';
      return;
    }
  } catch (err) {
    console.error('Failed to load session', err);
    msgEl.textContent = 'Could not load user info';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updateData = {
      name: form.name.value,
      birthdate: form.birthdate.value,
      address: form.address.value,
      phone: form.phone.value,
      requested_games: form.games.value,
      requested_role: form.role.value,
    };
    try {
      user = await updateUser(user.id, updateData);
      msgEl.textContent = 'Saved';
      fillForm(user);
    } catch (err) {
      console.error('Failed to update user', err);
      msgEl.textContent = err.message;
    }
  });

  try {
    const res = await fetch('/api/games');
    if (!res.ok) throw new Error(res.status);
    const games = await res.json();
    if (Array.isArray(games) && games.length) {
      gamesListEl.innerHTML = '';
      for (const g of games) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        const label = gameRegistry[g.game_type]?.label || g.game_type;
        li.textContent = `${g.game_id}: ${label}`;
        gamesListEl.appendChild(li);
      }
    } else {
      gamesEmptyEl.textContent = 'No games found.';
    }
  } catch (err) {
    console.error('Failed to load games', err);
    gamesEmptyEl.textContent = 'Could not load games.';
  }

  function fillForm(u) {
    form.name.value = u.name || '';
    form.email.value = u.email || '';
    form.birthdate.value = u.birthdate ? u.birthdate.slice(0,10) : '';
    form.address.value = u.address || '';
    form.phone.value = u.phone || '';
    form.games.value = u.requested_games || '';
    form.role.value = u.requested_role || u.role || 'Player';
  }
}