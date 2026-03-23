import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { updateProfileApi } from '../services/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (t) => {
      if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listen for system theme changes if set to system
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const changeTheme = async (newTheme, skipSync = false) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Persist to backend if user is logged in and sync is not skipped
    if (user && !skipSync) {
      try {
        const res = await updateProfileApi({ theme: newTheme });
        if (res && res.statusCode === 200 && res.data) {
          setUser(res.data);
        }
      } catch (error) {
        console.error('Failed to sync theme to backend:', error);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  // Sync theme from user profile when user changes
  useEffect(() => {
    if (user && user.theme && user.theme !== theme) {
      changeTheme(user.theme, true);
    }
  }, [user]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme, toggleTheme }}>
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
