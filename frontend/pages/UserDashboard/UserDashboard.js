import { getSession } from '../../services/api/userAPI.js';

export default async function init() {
  const userInfoEl = document.getElementById('user-info');
  const gamesListEl = document.getElementById('games-list');
  const gamesEmptyEl = document.getElementById('games-empty');

  try {
    const user = await getSession();
    if (user && user.email) {
      userInfoEl.textContent = `${user.email} (id: ${user.id})`;
    } else {
      userInfoEl.textContent = 'Not logged in';
      return;
    }
  } catch (err) {
    console.error('Failed to load session', err);
    userInfoEl.textContent = 'Could not load user info';
    return;
  }

  try {
    const res = await fetch('/api/games');
    if (!res.ok) throw new Error(res.status);
    const games = await res.json();
    if (Array.isArray(games) && games.length) {
      gamesListEl.innerHTML = '';
      for (const g of games) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${g.game_id}: ${g.game_type}`;
        gamesListEl.appendChild(li);
      }
    } else {
      gamesEmptyEl.textContent = 'No games found.';
    }
  } catch (err) {
    console.error('Failed to load games', err);
    gamesEmptyEl.textContent = 'Could not load games.';
  }
}