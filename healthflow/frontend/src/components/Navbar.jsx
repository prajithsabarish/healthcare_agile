import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        {/* Breadcrumbs or Current Project Title can go here */}
        <h2 className="text-lg font-medium text-gray-800">Agile Workspace</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-healthcare-teal transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-healthcare-blue text-white flex items-center justify-center">
            <User size={16} />
          </div>
          <button 
            onClick={logout}
            className="text-gray-500 hover:text-red-600 transition-colors ml-2"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
