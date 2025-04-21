import { fetchMapTiles } from '../../js/api/mapAPI.js'; // keeps dev server happy

const listEl    = document.getElementById('game-list');
const mapLink   = document.getElementById('map-link');
const newBtn    = document.getElementById('new-game-btn');

updateMapLink();          // greyed‑out on load
loadGames();              // fill list

/* ----- create new game ----- */
newBtn.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_type: 'kingdom' })
    });
    const { game_id } = await res.json();
    localStorage.setItem('currentGameId', game_id);
    updateMapLink(true);       // enable link
    loadGames();               // refresh list
  } catch (err) {
    console.error(err);
    alert('Could not create game.');
  }
});

/* ----- helpers ----- */
function updateMapLink(enabled = false) {
  const hasId = enabled || !!localStorage.getItem('currentGameId');
  mapLink.style.pointerEvents = hasId ? 'auto' : 'none';
  mapLink.style.opacity       = hasId ? '1'   : '.4';
}

async function loadGames() {
  const res   = await fetch('/api/games');
  const games = await res.json();

  listEl.innerHTML = '';           // clear list
  if (!games.length) {
    listEl.textContent = '— none yet —';
    return;
  }

  games.forEach(g => {
    const li     = document.createElement('li');
    li.textContent =
      `${new Date(g.created_at).toLocaleDateString()} · ${g.game_type}`;
    li.style.cursor = 'pointer';
    li.onclick = () => {
      localStorage.setItem('currentGameId', g.game_id);
      updateMapLink(true);
    };
    listEl.append(li);
    mapLink.classList.toggle('disabled', !hasId);
  });
}
