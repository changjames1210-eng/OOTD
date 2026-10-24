const themeStorageKey = 'ootd-theme';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

function preferredTheme() {
  return localStorage.getItem(themeStorageKey) || (systemTheme.matches ? 'dark' : 'light');
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    const dark = theme === 'dark';
    const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.querySelector('span').textContent = dark ? '☀' : '☾';
  });
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    const selected = button.dataset.themeChoice === theme;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

applyTheme(preferredTheme());

document.querySelectorAll('[data-theme-toggle]').forEach(button => {
  button.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  });
});

document.querySelectorAll('[data-theme-choice]').forEach(button => {
  button.addEventListener('click', () => {
    localStorage.setItem(themeStorageKey, button.dataset.themeChoice);
    applyTheme(button.dataset.themeChoice);
  });
});

systemTheme.addEventListener('change', event => {
  if (!localStorage.getItem(themeStorageKey)) applyTheme(event.matches ? 'dark' : 'light');
});
