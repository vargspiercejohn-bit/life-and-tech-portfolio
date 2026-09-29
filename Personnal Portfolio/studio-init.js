(() => {
  const root = document.documentElement;
  let theme;
  try {
    theme = localStorage.getItem('theme');
  } catch { /* Private browsing may make storage unavailable. */ }
  root.dataset.theme = ['light', 'dark'].includes(theme) ? theme :
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  // This portfolio uses automatic motion, independent of saved or system preferences.
  root.dataset.motion = 'full';
})();
