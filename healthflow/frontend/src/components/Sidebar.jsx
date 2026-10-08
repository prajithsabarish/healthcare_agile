import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ListTodo, 
  CalendarClock, 
  KanbanSquare, 
  MessageSquare,
  BarChart3,
  Activity,
  History,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Product Backlog', path: '/backlog', icon: <ListTodo size={20} /> },
    { name: 'Sprint Planning', path: '/planning', icon: <CalendarClock size={20} /> },
    { name: 'Scrum Board', path: '/board', icon: <KanbanSquare size={20} /> },
    { name: 'Daily Scrum', path: '/daily-scrum', icon: <MessageSquare size={20} /> },
    { name: 'Sprint Review', path: '/review', icon: <CheckSquare size={20} /> },
    { name: 'Retrospective', path: '/retrospective', icon: <History size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Activity className="text-healthcare-teal mr-2" size={24} />
        <span className="text-xl font-bold text-healthcare-dark">HealthFlow</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-healthcare-teal text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-healthcare-blue'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
          
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Admin
              </p>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-healthcare-teal text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-healthcare-blue'
                  }`
                }
              >
                Users Management
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
