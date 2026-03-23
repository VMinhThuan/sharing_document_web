import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="material-symbols-outlined dark:hidden">dark_mode</span>
      <span className="material-symbols-outlined hidden dark:block">light_mode</span>
    </button>
  );
};

export default ThemeToggle;
