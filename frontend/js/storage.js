export const GameStorage = {
  key: 'current_game_id',

  set(id) {
    localStorage.setItem(this.key, String(id));
  },

  get() {
    const v = localStorage.getItem(this.key);
    return v ? Number(v) : null;
  },

  clear() { localStorage.removeItem(this.key); }
};
