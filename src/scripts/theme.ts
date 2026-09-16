// src/scripts/theme.ts

export function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('stelladore-theme', theme);

  const buttons = document.querySelectorAll<HTMLButtonElement>('.theme-btn');
  buttons.forEach((btn) => {
    const btnTheme = btn.getAttribute('data-set-theme');
    if (btnTheme === theme) {
      btn.classList.add('active-theme-btn');
      btn.classList.remove('text-[var(--theme-text-muted)]');
    } else {
      btn.classList.remove('active-theme-btn');
      btn.classList.add('text-[var(--theme-text-muted)]');
    }
  });

  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
}

export function initThemeToggle() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current);

  const buttons = document.querySelectorAll<HTMLButtonElement>('.theme-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-set-theme');
      if (theme) {
        applyTheme(theme);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}

document.addEventListener('astro:page-load', initThemeToggle);
