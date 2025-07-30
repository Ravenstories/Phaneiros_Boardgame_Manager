import { getSession } from '../../services/api/userAPI.js';
import { getToken } from '../../services/userStore.js';

export default async function init() {
  const table = document.getElementById('user-table').querySelector('tbody');
  const msgEl = document.getElementById('panel-msg');

  try {
    await getSession();
    const res = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error(res.status);
    const users = await res.json();
    table.innerHTML = '';
    users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${u.id}</td><td>${u.email}</td><td>${u.role}</td>`;
      table.appendChild(tr);
    });
  } catch (err) {
    msgEl.textContent = 'Failed to load users';
    console.error(err);
  }
}