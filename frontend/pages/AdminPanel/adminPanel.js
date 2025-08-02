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
    const [userRes, gameRes] = await Promise.all([
      fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/games')
    ]);
    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      throw new Error(`Users ${userRes.status}: ${err.error || userRes.statusText}`);
    }
    if (!gameRes.ok) {
      const err = await gameRes.json().catch(() => ({}));
      throw new Error(`Games ${gameRes.status}: ${err.error || gameRes.statusText}`);
    }
    const users = await userRes.json();
    const games = await gameRes.json();
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
          if (!updateRes.ok) {
            const err = await updateRes.json().catch(() => ({}));
            throw new Error(`${updateRes.status}: ${err.error || updateRes.statusText}`);
          }
          tr.querySelector('.user-role').textContent = select.value;
          msgEl.textContent = '';
        } catch (err) {
          msgEl.textContent = `Failed to update role: ${err.message}`;
          console.error(err);
        }
      });
      td.appendChild(select);
      td.appendChild(btn);
      tr.appendChild(td);
      table.appendChild(tr);

      const gmTd = document.createElement('td');
      const gmSelect = document.createElement('select');
      gmSelect.className = 'form-select form-select-sm';
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Select Game';
      placeholder.selected = true;
      placeholder.disabled = true;
      gmSelect.appendChild(placeholder);
      games.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.game_id;
        opt.textContent = g.game_name ? `${g.game_name} (ID ${g.game_id})` : `Game ${g.game_id}`;
        gmSelect.appendChild(opt);
      });
      const gmBtn = document.createElement('button');
      gmBtn.className = 'btn btn-sm btn-secondary mt-1';
      gmBtn.textContent = 'Assign GM';
      gmBtn.addEventListener('click', async () => {
        if (!gmSelect.value) return;
        try {
          const resp = await fetch(`/api/games/${gmSelect.value}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ user_id: u.id, role: 'Game Master' })
          });
          if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(`${resp.status} ${err.code || ''} ${err.error || resp.statusText}`.trim());
          }
          msgEl.textContent = '';
        } catch (err) {
          msgEl.textContent = `Failed to assign GM: ${err.message}`;
          console.error(err);
        }
      });
      gmTd.appendChild(gmSelect);
      gmTd.appendChild(gmBtn);
      tr.appendChild(gmTd);
    });
  } catch (err) {
    msgEl.textContent = 'Failed to load users';
    console.error(err);
  }
}