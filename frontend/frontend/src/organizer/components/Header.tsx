import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Connect</h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}