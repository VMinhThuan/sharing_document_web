import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../contexts/AuthContext';

const TopHeader = ({ title, children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-8 absolute top-0 left-0 right-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        {children}
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <ThemeToggle />
        {isAuthenticated && <NotificationDropdown />}
      </div>
    </header>
  );
};

export default TopHeader;
