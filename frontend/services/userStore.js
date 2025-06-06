let currentUser = null;

export function login(user) {
  currentUser = user;
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

export function getUser() {
  if (currentUser) return currentUser;
  const stored = localStorage.getItem('user');
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }
  return null;
}

export function isLoggedIn() {
  return !!getUser();
}

export function getToken() {
  return localStorage.getItem('token');
}
