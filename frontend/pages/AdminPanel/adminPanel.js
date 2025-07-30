import { getSession } from '../../services/api/userAPI.js';
import { getToken } from '../../services/userStore.js';

export default async function init() {
  const table = document.getElementById('user-table').querySelector('tbody');
  const msgEl = document.getElementById('panel-msg');

  try {
    await getSession();
    const token = getToken();
    const res = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(res.status);
    const users = await res.json();
    table.innerHTML = '';
    users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${u.id}</td><td>${u.email}</td><td class="user-role">${u.role}</td>`;
      const td = document.createElement('td');
      const select = document.createElement('select');
      select.className = 'form-select form-select-sm';
      ['Admin', 'Game Master', 'Player', 'Guest'].forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        if (u.role === r) opt.selected = true;
        select.appendChild(opt);
      });
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-primary mt-1';
      btn.textContent = 'Save';
      btn.addEventListener('click', async () => {
        try {
          const updateRes = await fetch(`/api/users/${u.id}/role`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ role: select.value })
          });
          if (!updateRes.ok) throw new Error(updateRes.status);
          tr.querySelector('.user-role').textContent = select.value;
          msgEl.textContent = '';
        } catch (err) {
          msgEl.textContent = 'Failed to update role';
          console.error(err);
        }
      });
      td.appendChild(select);
      td.appendChild(btn);
      tr.appendChild(td);
      table.appendChild(tr);
    });
  } catch (err) {
    msgEl.textContent = 'Failed to load users';
    console.error(err);
  }
}