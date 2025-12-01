document.getElementById('darkModeToggle').addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', newTheme);
  chrome.storage.sync.set({ darkMode: newTheme === 'dark' });
  document.getElementById('darkModeToggle').textContent = newTheme === 'dark' ? 'Light' : 'Dark';
});

chrome.storage.sync.get(['darkMode'], (res) => {
  const theme = res.darkMode ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
  document.getElementById('darkModeToggle').textContent = theme === 'dark' ? 'Light' : 'Dark';
});