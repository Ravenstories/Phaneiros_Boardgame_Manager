// core/authService.js
// Handles login, logout, signup and role checks

import { userStore } from '../services/userStore.js';

export async function login(email, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error('Login failed');
  const user = await res.json();
  userStore.login(user);
  return user;
}

export async function signup(email, password) {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error('Signup failed');
  return await res.json();
}

export function logout() {
  userStore.logout();
}

export async function checkSession() {
  const res = await fetch('/api/session');
  if (!res.ok) return null;
  const user = await res.json();
  userStore.login(user);
  return user;
}

export function hasRole(user, role, gameId = null) {
  if (!user?.roles) return false;
  return user.roles.some(r =>
    r.name === role && (gameId == null || r.game_id === gameId)
  );
}
