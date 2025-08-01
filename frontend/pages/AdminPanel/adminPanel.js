import { getSession } from '../../services/api/userAPI.js';
import { getToken } from '../../services/userStore.js';
import { hasPermission } from '../../services/roleService.js';

export default async function init() {
  if (!hasPermission('Admin')) {
    document.getElementById('panel-msg').textContent = 'Access denied';
    return;
  }

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

      const gmTd = document.createElement('td');
      const gmInput = document.createElement('input');
      gmInput.className = 'form-control form-control-sm';
      gmInput.placeholder = 'Game ID';
      const gmBtn = document.createElement('button');
      gmBtn.className = 'btn btn-sm btn-secondary mt-1';
      gmBtn.textContent = 'Assign GM';
      gmBtn.addEventListener('click', async () => {
        try {
          const resp = await fetch(`/api/games/${gmInput.value}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ user_id: u.id, role: 'Game Master' })
          });
          if (!resp.ok) throw new Error(resp.status);
          msgEl.textContent = '';
        } catch (err) {
          msgEl.textContent = 'Failed to assign GM';
          console.error(err);
        }
      });
      gmTd.appendChild(gmInput);
      gmTd.appendChild(gmBtn);
      tr.appendChild(gmTd);
    });
  } catch (err) {
    msgEl.textContent = 'Failed to load users';
    console.error(err);
  }
}