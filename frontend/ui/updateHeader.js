import { isLoggedIn } from '../services/userStore.js';

export function updateHeader() {
  const dashboardItem = document.getElementById('nav-dashboard');
  const accountLink = document.getElementById('account-link');
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
}

document.addEventListener('DOMContentLoaded', updateHeader);