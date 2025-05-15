/* -------- imports -------- */
import { GameStorage }       from '../../js/storage.js';          // localStorage helper
import { renderCurrentGame } from '../../js/currentGameHeader.js'; // fills <div id="current-game">

/* -------- DOM handles -------- */
const listEl  = document.getElementById('game-list');
const mapLink = document.getElementById('map-link');
const newBtn  = document.getElementById('new-game-btn');

/* -------- boot -------- */
init();

async function init() {
  updateMapLink();          // grey-out on first load if no game saved
  await loadGames();        // build game list
  renderCurrentGame();      // show banner if a game was chosen on a prev. visit
}

/* ------------------------------------------------------------------ */
/*  CREATE NEW GAME                                                    */
/* ------------------------------------------------------------------ */
newBtn.addEventListener('click', async () => {
  try {
    const res      = await fetch('/api/games', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ game_type: 'kingdom' })
    });
    const { game_id } = await res.json();

    GameStorage.set(game_id);     // remember it
    updateMapLink(true);
    await loadGames();            // refresh list
    renderCurrentGame();          // refresh banner
  } catch (err) {
    console.error(err);
    alert('Could not create game.');
  }
});

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

/* enable / disable "Go to map" link */
function updateMapLink(force = false) {
  const enabled = force || !!GameStorage.get();
  mapLink.style.pointerEvents = enabled ? 'auto' : 'none';
  mapLink.style.opacity       = enabled ? '1'   : '.4';
}

/* rebuild UL #game-list */
async function loadGames() {
  const res   = await fetch('/api/games');
  const games = await res.json();

  listEl.innerHTML = '';
  if (!games.length) {
    listEl.textContent = '— none yet —';
    return;
  }

  games.forEach(g => {
    const li = document.createElement('li');
    li.className   = 'game-row';                // useful for CSS/testing
    li.dataset.id  = g.game_id;                 // store the id
    li.tabIndex    = 0;                         // keyboard focusable
    li.style.cursor = 'pointer';
    li.textContent =
      `${new Date(g.created_at).toLocaleDateString()} · ${g.game_type}`;

    li.addEventListener('click', () => {
      GameStorage.set(g.game_id);               // remember choice
      updateMapLink(true);
      renderCurrentGame();                      // update header banner
    });

    listEl.append(li);
  });
}
