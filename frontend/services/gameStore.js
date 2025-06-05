/* global store for the currently loaded game */
const KEY = 'current_game_id';
const listeners = new Set();

export function getGameId() {
  return localStorage.getItem(KEY);     // UUID or null
}

export function setGameId(id) {
  localStorage.setItem(KEY, String(id));
  listeners.forEach(fn => fn(id));
}

export function clearGameId() {
  localStorage.removeItem(KEY);
  listeners.forEach(fn => fn(null));
}

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);   // returns “unsubscribe”
}

export function subscribe(fn) {
  fn(getGameId());
  return onChange(fn);
}