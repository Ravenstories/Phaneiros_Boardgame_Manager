import { isLoggedIn } from '../services/userStore.js';

export function updateHeader() {
  const loggedIn = isLoggedIn();

  // Define nav items by role
  const navItems = {
    dashboard: document.getElementById('nav-dashboard'),
    account: document.getElementById('account-link'),
    home: document.getElementById('home-link'),
    game: document.getElementById('game-link'),
    map: document.getElementById('map-link')
  };

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
}

// Re-run on DOM ready
document.addEventListener('DOMContentLoaded', updateHeader);