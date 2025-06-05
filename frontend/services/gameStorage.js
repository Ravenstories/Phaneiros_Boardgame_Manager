// frontend/services/gameStorage.js
const KEY = 'current_game_id';

export const gameStorage = {
  get() {
    const v = localStorage.getItem(KEY);
    return v ? String(v) : null;
  },
  set(id) {
    localStorage.setItem(KEY, String(id));
  },
  clear() {
    localStorage.removeItem(KEY);
  }
};
