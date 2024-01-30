'use client'

import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => { } });

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState('dark');


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    window.localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const localTheme = window.localStorage.getItem('theme');
      if (localTheme) {
        setTheme(localTheme);
      }
    }

    setTheme(theme);
    let newTheme = theme;
    if (theme === 'dark') {
      newTheme = 'dark'
    }
    if (theme === 'light') {
      newTheme = 'light'
    }
    document.querySelector('html')?.setAttribute('data-theme', newTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};