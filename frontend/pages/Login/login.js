import { login } from '../../core/authService.js';
import { navigateTo } from '../../core/router.js';

export default function init({ target }) {
  const form = target.querySelector('#login-form');
  const error = target.querySelector('#login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';
    const data = new FormData(form);
    try {
      await login(data.get('email'), data.get('password'));
      navigateTo('start');
    } catch (err) {
      error.textContent = 'Login failed: ' + err.message;
    }
  });
}
