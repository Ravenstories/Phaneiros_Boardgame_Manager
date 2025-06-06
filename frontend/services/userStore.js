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

let currentUser = null;

export function login(user) {
  currentUser = user;
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  currentUser = null;
  localStorage.removeItem('user');
}

export function getUser() {
  if (currentUser) return currentUser;
  const stored = localStorage.getItem('user');
  if (stored) currentUser = JSON.parse(stored);
  return currentUser;
}
