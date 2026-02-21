import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    background: '#000',
    text: '#fff',
    card: '#111',
    cardBorder: '#222',
    accent: '#00ff88',
    accentDim: 'rgba(0, 255, 136, 0.1)',
    accentBorder: 'rgba(0, 255, 136, 0.2)',
    secondary: '#666',
    tertiary: '#888',
    glassCard: 'rgba(255, 255, 255, 0.02)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.9)',
    positive: '#4f8',
    negative: '#f44',
    warning: '#ffaa00',
  },
  light: {
    background: '#ffffff',
    text: '#000',
    card: '#f2f2f2',
    cardBorder: '#ddd',
    accent: '#007f5f',
    accentDim: 'rgba(0, 127, 95, 0.1)',
    accentBorder: 'rgba(0, 127, 95, 0.2)',
    secondary: '#666',
    tertiary: '#888',
    glassCard: 'rgba(0, 0, 0, 0.02)',
    glassBorder: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(255, 255, 255, 0.95)',
    positive: '#00aa44',
    negative: '#cc0000',
    warning: '#ff8800',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
