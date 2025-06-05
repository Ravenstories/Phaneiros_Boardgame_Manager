/***************************************************************************
 * Start component (game list)
 * called by loadComponents.mount(rootElement)
 ***************************************************************************/

import {
  getGameId, setGameId, clearGameId, onChange
} from '../../js/gameStore.js';

export default async function init(root) {
  if (!root || root.dataset.initialised) return;   // run once
  root.dataset.initialised = 'y';

  /* DOM refs scoped to this root --------------------------------------- */
  const tbody      = root.querySelector('#game-table tbody');
  const emptyMsg   = root.querySelector('#empty-msg');
  const loadedTag  = root.querySelector('#loaded-tag');
  const mapLink    = root.querySelector('#map-link');
  const newBtn     = root.querySelector('#btn-new');
  const refreshBtn = root.querySelector('#btn-refresh');
  const deleteBtn  = root.querySelector('#btn-delete');

  /* boot ---------------------------------------------------------------- */
  onChange(updateUI);
  updateUI(getGameId());
  loadGames();

  newBtn.onclick     = createGame;
  refreshBtn.onclick = loadGames;
  deleteBtn.onclick  = deleteCurrent;

  /* UI helpers ---------------------------------------------------------- */
  function updateUI(id) {
    const en = !!id;
    loadedTag.textContent       = en ? `Loaded: ${id}` : 'No game loaded.';
    mapLink.style.pointerEvents = en ? 'auto':'none';
    mapLink.style.opacity       = en ? '1':'.4';
    mapLink.tabIndex            = en ? '0':'-1';
    deleteBtn.disabled          = !en;
    highlightRow(id);
  }

  /* network ------------------------------------------------------------- */
  async function loadGames() {
    spin(true);
    try {
      const res   = await fetch('/api/games');
      const games = await res.json();
      renderRows(games);
    } catch (e) { console.error(e); alert('Could not load games.'); }
    finally     { spin(false); }
  }

  async function createGame() {
    spin(true);
    try {
      const res = await fetch('/api/games', {
        method :'POST',
        headers:{'Content-Type':'application/json'},
        body   : JSON.stringify({game_type:'kingdom'})
      });
      const {game_id} = await res.json();
      setGameId(game_id);
      await loadGames();
    } catch (e) { console.error(e); alert('Could not create game.'); }
    finally     { spin(false); }
  }

  async function deleteCurrent() {
    const id = getGameId();
    if (!id || !confirm('Delete this game?')) return;
    spin(true);
    try {
      await fetch(`/api/games/${id}`, {method:'DELETE'});
      clearGameId();
      await loadGames();
    } catch (e) { console.error(e); alert('Could not delete game.'); }
    finally     { spin(false); }
  }

  /* dom ----------------------------------------------------------------- */
  function renderRows(games) {
    tbody.innerHTML = '';
    if (!games.length) { emptyMsg.textContent = '— no games yet —'; return; }
    emptyMsg.textContent = '';
    games.forEach(g => {
      const tr = document.createElement('tr');
      tr.innerHTML =
        `<td>${new Date(g.created_at).toLocaleDateString()}</td><td>${g.game_type}</td>`;
      tr.dataset.id = g.game_id;
      tr.onclick    = () => setGameId(g.game_id);
      tbody.append(tr);
    });
    highlightRow(getGameId());
  }

  function highlightRow(id) {
    Array.from(tbody.children)
      .forEach(tr => tr.classList.toggle('active', tr.dataset.id === id));
  }

  function spin(on) { root.classList.toggle('loading', on); }
}
