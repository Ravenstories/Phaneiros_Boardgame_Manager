import { renderCurrentGame } from './currentGameHeader.js';
import { GameStorage }       from './storage.js';

/* 1️⃣  Render the header as soon as the DOM is ready */
document.addEventListener('DOMContentLoaded', renderCurrentGame);

/* 2️⃣  Game list click handler
   Assumes your “front screen” lists games in elements
   that contain a data-id attribute.  Example:

   <li class="game-row" data-id="17">Kingdom #17</li>
*/
document.addEventListener('click', async (ev) => {
  const row = ev.target.closest('.game-row');
  if (!row) return;

  const id = Number(row.dataset.id);
  if (!id) return;

  /* (a) remember it for the next reload / page */
  GameStorage.set(id);

  /* (b) immediately update the header */
  await renderCurrentGame();

  /* (c) now you can navigate or load tiles, e.g. */
  loadMapTiles(id);          // <-- your existing map JS
});
