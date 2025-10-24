import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  Users,
  Building2,
  BookOpen,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
// import { useUserDisplayName } from '../../hooks/useUserDetails';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  // const { name: displayName, isLoading: nameLoading } = useUserDisplayName();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: Building2, label: 'Department Management', path: '/admin/departments' },
        ];
      case 'department_manager':
        return [
          { icon: MessageSquare, label: t('nav.chat'), path: '/chat' },
          { icon: Building2, label: t('nav.provinces'), path: '/provinces' },
        ];
      case 'province_manager':
        return [
          { icon: Users, label: t('nav.schools'), path: '/schools' },
          { icon: MessageSquare, label: t('nav.chat'), path: '/chat' },
        ];
      case 'school_manager':
        return [
          { icon: Users, label: 'Quản lý trường học', path: '/school-management' },
          { icon: FileText, label: t('nav.documents'), path: '/documents' },
          { icon: MessageSquare, label: t('nav.chat'), path: '/chat' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 h-full flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">TKGD</h1>
              <p className="text-sm text-gray-600 capitalize">VietTechKey</p>
            </div>
          </div>
        </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                onClick={() => {
                  // Close mobile sidebar when navigating
                  if (onClose) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            {user?.name || 'User'}
          </h3>
          <p className="text-sm text-gray-600 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;