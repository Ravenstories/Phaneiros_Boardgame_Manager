import { signupUser } from '../../services/api/userAPI.js';

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm-password').value;
  if (password !== confirm) {
    alert('Passwords do not match');
    return;
  }
  try {
    await signupUser(email, password);
    window.location.href = '/';
  } catch (err) {
    alert(err.message);
  }
});