import { loginUser, getSession } from '../../services/api/userAPI.js';
import { login } from '../../services/userStore.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await loginUser(email, password);
    const user = await getSession();
    if (user) login(user);
    window.location.href = '/';
  } catch (err) {
    alert(err.message);
  }
});