'use client';

import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

const applyTheme = (t: Theme) => {
  const root = document.documentElement;
  if (t === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else if (t === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';

  const saved = localStorage.getItem('myreply-theme') as Theme | null;
  if (saved === 'dark' || saved === 'light' || saved === 'system') {
    applyTheme(saved);
    return saved;
  }

  return 'system';
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('myreply-theme', next);
    applyTheme(next);
  };

  // Определяем текущую реальную тему для иконки
  const isDark = theme === 'dark' || 
    (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted-light transition-colors"
      aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
