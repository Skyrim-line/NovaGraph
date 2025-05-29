// ThemeContext.js
import { createContext, useState } from 'react';
import { darkModeToken, lightModeToken } from './themeConfig';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentThemeToken = isDarkMode ? darkModeToken : lightModeToken;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, currentThemeToken }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;