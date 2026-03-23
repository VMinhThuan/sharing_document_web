import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const TopHeader = ({ title, children }) => {
  return (
    <header className="h-16 flex items-center justify-between px-8 absolute top-0 left-0 right-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        {children}
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <ThemeToggle />
        <button className="p-2 relative rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a202c]"></span>
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
