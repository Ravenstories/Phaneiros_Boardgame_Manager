import { signup } from '../../core/authService.js';
import { navigateTo } from '../../core/router.js';

export default function init({ target }) {
  const form = target.querySelector('#signup-form');
  const error = target.querySelector('#signup-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';
    const data = new FormData(form);
    try {
      await signup(data.get('email'), data.get('password'));
      navigateTo('login');
    } catch (err) {
      error.textContent = 'Signup failed: ' + err.message;
    }
  });
}