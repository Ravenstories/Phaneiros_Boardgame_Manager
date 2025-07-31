import { isLoggedIn, getUser } from '../services/userStore.js';
import { RolePriority } from '../services/roleService.js';

export function updateHeader() {
  const loggedIn = isLoggedIn();

  // Define nav items by role
  const navItems = {
    dashboard: document.getElementById('nav-dashboard'),
    account: document.getElementById('account-link'),
    home: document.getElementById('home-link'),
    game: document.getElementById('game-link'),
    map: document.getElementById('map-link'),
    admin: document.getElementById('admin-link'),
    gm: document.getElementById('gm-link')
  };

  const role = getUser()?.role || 'Guest';
  const isAdmin = RolePriority[role] >= RolePriority.Admin;
  const isGM = RolePriority[role] >= RolePriority['Game Master'];

  // Toggle visibility of links based on auth state
  if (navItems.dashboard) {
    navItems.dashboard.classList.toggle('d-none', !loggedIn);
  }

  if (navItems.account) {
    if (loggedIn) {
      navItems.account.textContent = 'Logout';
      navItems.account.removeAttribute('data-page');
      navItems.account.onclick = () => {
        localStorage.clear();
        window.navigateTo('welcome');
        location.reload();
      };
    } else {
      navItems.account.textContent = 'Login / Signup';
      navItems.account.setAttribute('data-page', 'login');
      navItems.account.onclick = null;
    }
  }

  if (navItems.home) {
    navItems.home.setAttribute('data-page', loggedIn ? 'userDashboard' : 'welcome');
  }

  if (navItems.game) {
    navItems.game.classList.toggle('d-none', !loggedIn);
    navItems.game.setAttribute('data-page', loggedIn ? 'gameChooser' : '');
  }

  if (navItems.map) {
    navItems.map.classList.toggle('d-none', !loggedIn);
    navItems.map.setAttribute('data-page', loggedIn ? 'mapScreen' : '');
  }
  
  if (navItems.admin) {
    navItems.admin.classList.toggle('d-none', !isAdmin);
  }

  if (navItems.gm) {
    navItems.gm.classList.toggle('d-none', !isGM);
  }
}

// Re-run on DOM ready
document.addEventListener('DOMContentLoaded', updateHeader);