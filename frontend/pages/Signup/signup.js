import { signupUser } from '../../services/api/userAPI.js';

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const birthdate = document.getElementById('birthdate').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const phone = document.getElementById('phone').value;
  const games = document.getElementById('games').value;
  const role = document.getElementById('role').value;
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm-password').value;
  if (password !== confirm) {
    alert('Passwords do not match');
    return;
  }
  try {
    await signupUser({
      name,
      birthdate,
      email,
      address,
      phone,
      requested_games: games,
      requested_role: role,
      password,
    });
    window.location.href = '/';
  } catch (err) {
    alert(err.message);
  }
});