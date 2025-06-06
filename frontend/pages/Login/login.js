import { loginUser } from '../services/api/userAPI.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await loginUser(email, password);
    window.location.href = '/pages/Start/start.html';
  } catch (err) {
    alert(err.message);
  }
});
