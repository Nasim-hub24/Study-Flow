import React, { createContext, useContext, useEffect, useState } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'light', name: 'Light Flow', icon: '☀️' },
  { id: 'dark', name: 'Dark Mode', icon: '🌙' },
  { id: 'cupcake', name: 'Cupcake Pastel', icon: '🧁' },
  { id: 'emerald', name: 'Emerald Focus', icon: '🍃' },
  { id: 'synthwave', name: 'Synthwave Neon', icon: '🌆' },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return getFromStorage(STORAGE_KEYS.THEME, 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveToStorage(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, changeTheme, availableThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
