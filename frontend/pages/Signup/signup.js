import { signupUser } from '../../services/api/userAPI.js';

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signupUser(email, password);
    window.location.href = '/pages/Login/login.html';
  } catch (err) {
    alert(err.message);
  }
});
