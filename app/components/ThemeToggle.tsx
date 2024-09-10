'use client'

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light');
    }
  }, [theme, mounted]);

  if (!mounted) return null;

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <button
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
