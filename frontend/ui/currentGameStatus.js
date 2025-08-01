import { gameStorage } from '../services/gameStorage.js';

/**
 * Fetches /api/games/:id and injects a line like
 * “Game #17 (kingdom) – created 2025-05-15”
 * into the <div id="current-game">.
 */
export async function renderCurrentGameStatus() {
  const container = document.getElementById('current-game');
  if (!container) return;                       // safety

  const id = gameStorage.get();
  if (!id) { container.textContent = ''; return; }

  try {
    const res  = await fetch(`/api/games/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const game = await res.json();

    const name  = game.game_name || `Game ${game.game_id}`;
    container.innerHTML =
      `${name} <span class="text-muted">(${game.game_type})</span> – `
    + new Date(game.created_at).toLocaleString();

  } catch (err) {
    console.error('Couldn’t load current game:', err);
    container.textContent = '⚠️ Error loading game';
  }
}