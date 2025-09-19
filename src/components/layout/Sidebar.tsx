import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Upload,
  FileText,
  Users,
  Building2,
  BarChart3,
  Settings,
  BookOpen,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
// import { useUserDisplayName } from '../../hooks/useUserDetails';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  // const { name: displayName, isLoading: nameLoading } = useUserDisplayName();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: BarChart3, label: t('nav.dashboard'), path: '/dashboard' },
          { icon: Users, label: t('nav.userManagement'), path: '/admin/users' },
          { icon: Building2, label: t('nav.systemTree'), path: '/admin/tree' },
          { icon: FileText, label: t('nav.documentStore'), path: '/admin/documents' },
          { icon: FileText, label: 'Document Management', path: '/documents' },
          { icon: Database, label: 'Document Indexing', path: '/documents/indexing' },
        ];
      case 'department_manager':
        return [
          { icon: MessageSquare, label: t('nav.chat'), path: '/chat' },
          { icon: Building2, label: t('nav.provinces'), path: '/provinces' },
          { icon: FileText, label: t('nav.documents'), path: '/documents' },
        ];
      case 'province_manager':
        return [
          { icon: Users, label: t('nav.schools'), path: '/schools' },
          { icon: FileText, label: t('nav.documents'), path: '/documents' },
          { icon: MessageSquare, label: t('nav.chat'), path: '/chat' },
        ];
      case 'school_manager':
        return [
          { icon: MessageSquare, label: t('nav.chat'), path: '/dashboard' },
          { icon: FileText, label: t('nav.documents'), path: '/documents' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduChat</h1>
            <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
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
  );
};

export default Sidebar;