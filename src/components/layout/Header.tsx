import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Chào mừng bạn tới hệ thống thống kê giáo dục
          </h2>
          <p className="text-gray-600">
            {user?.role === 'school_manager' && 'Quản lý trường học'}
            {user?.role === 'province_manager' && 'Quản lý xã'}
            {user?.role === 'department_manager' && 'Quản lý sở'}
            {user?.role === 'admin' && 'Quản lý hệ thống'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">{t('auth.logout')}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;