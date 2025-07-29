import { isLoggedIn } from '../services/userStore.js';
/*
export function updateHeader() {
  const dashboardItem = document.getElementById('nav-dashboard');
  const accountLink = document.getElementById('account-link');
  const homeLink = document.getElementById('home-link');
  const gameLink = document.getElementById('game-link');
  const mapLink = document.getElementById('map-link');
  const loggedIn = isLoggedIn();

  if (dashboardItem) {
    dashboardItem.classList.toggle('d-none', !loggedIn);
  }

  if (accountLink) {
    if (loggedIn) {
      accountLink.textContent = 'Logout';
      accountLink.removeAttribute('data-page');
      accountLink.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
      }, { once: true });
    } else {
      accountLink.textContent = 'Login / Signup';
      accountLink.setAttribute('data-page', 'login');

    }
  }
  if (homeLink) {
    homeLink.setAttribute('data-page', loggedIn ? 'userDashboard' : 'welcome');
  }
  if (gameLink) {
    gameLink.setAttribute('data-page', loggedIn ? 'gameChooser' : 'welcome');
  }
  if (mapLink) {
    mapLink.setAttribute('data-page', loggedIn ? 'mapScreen' : 'welcome');
  }
}


document.addEventListener('DOMContentLoaded', updateHeader);
*/

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