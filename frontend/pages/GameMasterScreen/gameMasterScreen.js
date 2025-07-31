import { getSession } from '../../services/api/userAPI.js';
import { getToken } from '../../services/userStore.js';
import { hasPermission } from '../../services/roleService.js';

export default async function init() {
  if (!hasPermission('GameMaster' || 'Admin')) {
    document.getElementById('gm-msg').textContent = 'Access denied';
    return;
  }

  const listEl = document.getElementById('gm-games');
  const msgEl = document.getElementById('gm-msg');

  try {
    const user = await getSession();
    const token = getToken();
    const gamesRes = await fetch(`/api/users/${user.id}/games`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!gamesRes.ok) throw new Error(gamesRes.status);
    const games = await gamesRes.json();
    for (const g of games) {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `<div>Game ${g.game_id} - ${g.role}</div>`;
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
    msgEl.textContent = 'Failed to load games';
    console.error(err);
  }
}