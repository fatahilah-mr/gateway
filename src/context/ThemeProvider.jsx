import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Fixed permanently to Dark Mode
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};
