import React from 'react';
import { Menu, Search } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import NotificationCenter from './notifications/NotificationCenter';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                type="button"
                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={onMenuClick}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Search - Hidden on mobile, visible on sm+ */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type="text"
                  placeholder="Search employees, documents..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-text-secondary focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="ml-4 flex items-center md:ml-6">
            {/* Mobile search button - visible only on mobile */}
            <button
              type="button"
              className="sm:hidden bg-white p-1 rounded-full text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-2"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <NotificationCenter />

            {/* Profile */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user?.name}
                />
                <div className="ml-3 hidden md:block">
                  <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-secondary">{user?.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;