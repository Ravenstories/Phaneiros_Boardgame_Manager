export const userStore = {
  current: null,
  listeners: new Set(),

  login(user) {
    this.current = user;
    this.listeners.forEach(fn => fn(user));
  },

  logout() {
    this.current = null;
    this.listeners.forEach(fn => fn(null));
  },

  subscribe(fn) {
    fn(this.current);
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
};
