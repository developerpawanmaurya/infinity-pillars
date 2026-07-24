import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ip-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return false;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Single source of truth for the site's light/dark toggle. The `.dark`
// class on <html> (see index.css's `.dark { ... }` variable block) is what
// every component actually reads via hsl(var(--...)) — this hook just owns
// flipping that class and remembering the choice. Every consumer shares one
// module-level listener list so the desktop and mobile toggle buttons (two
// separate component instances) stay in sync with each other.
const listeners = new Set();
let isDarkGlobal = getInitialTheme();

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  window.localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
}

if (typeof document !== 'undefined') {
  applyTheme(isDarkGlobal);
}

export function useTheme() {
  const [isDark, setIsDark] = useState(isDarkGlobal);

  useEffect(() => {
    listeners.add(setIsDark);
    return () => listeners.delete(setIsDark);
  }, []);

  const toggleTheme = useCallback(() => {
    isDarkGlobal = !isDarkGlobal;
    applyTheme(isDarkGlobal);
    listeners.forEach((fn) => fn(isDarkGlobal));
  }, []);

  return [isDark, toggleTheme];
}
