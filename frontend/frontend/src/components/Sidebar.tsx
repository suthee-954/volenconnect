import React from 'react';
import { Home, Search, MessageSquare, User, LogIn, Calendar, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/volunteer-dashboard' },
    { icon: Search, label: 'Search', path: '/volunteer-dashboard/search' },
    { icon: MessageSquare, label: 'Messages', path: '/volunteer-dashboard/messages' },
    { icon: User, label: 'Profile', path: '/volunteer-dashboard/profile' },
    { icon: Calendar, label: 'Enrolled Events', path: '/volunteer-dashboard/enrolled-events' },
    { icon: Star, label: 'Rating', path: '/volunteer-dashboard/rating' },
  ];
  
  return (
    <aside className="w-64 bg-gray-900 h-screen fixed left-0 flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Volunconnect
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-3">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
              location.pathname === path 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white font-medium' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
            aria-current={location.pathname === path ? 'page' : undefined}
          >
            <Icon className={`w-5 h-5 mr-3 ${
              location.pathname === path 
                ? 'text-purple-400' 
                : 'text-gray-500'
            }`} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      {location.pathname !== "/login" && (
        <div className="p-4 border-t border-gray-800 mt-6">
          <Link 
            to="/login"
            className="flex items-center px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
          >
            <LogIn className="w-5 h-5 mr-3" />
            Sign Out
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;