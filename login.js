const loginForm = document.getElementById('loginForm');
const existingAccount = JSON.parse(localStorage.getItem('ootd-current-user') || 'null');

if (existingAccount?.sex !== undefined) window.location.replace('index.html');

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('displayName').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const sex = document.getElementById('sex').value;
  const account = { name, email, sex, id: encodeURIComponent(email) };
  localStorage.setItem('ootd-current-user', JSON.stringify(account));
  window.location.href = 'index.html';
});
