export default async function init() {
  const listEl = document.getElementById('gm-games');
  const msgEl = document.getElementById('gm-msg');

  try {
    const res = await fetch('/api/session');
    const user = await res.json();
    const gamesRes = await fetch(`/api/users/${user.id}/games`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (!gamesRes.ok) throw new Error(gamesRes.status);
    const games = await gamesRes.json();
    games.forEach(g => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `Game ${g.game_id} - ${g.role}`;
      listEl.appendChild(li);
    });
  } catch (err) {
    msgEl.textContent = 'Failed to load games';
    console.error(err);
  }
}