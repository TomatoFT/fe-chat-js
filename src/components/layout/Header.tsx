import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLogout } from '../../hooks/useAuth';
import { LiveLoadStatsComponent } from '../statistics/LiveLoadStatsComponent';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout: authLogout } = useAuth();
  const { t } = useLanguage();
  const queryLogout = useLogout();

  const handleLogout = () => {
    // Clear React Query cache
    queryLogout();
    // Clear AuthContext state
    authLogout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Title Section */}
        <div className="flex-1 lg:flex-none">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
            <span className="hidden sm:inline">Chào mừng bạn tới hệ thống thống kê giáo dục</span>
            <span className="sm:hidden">TKGD</span>
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-sm lg:text-base text-gray-600 hidden sm:block">
              {/* {user?.role === 'school_manager' && 'Quản lý trường học'}
              {user?.role === 'province_manager' && 'Quản lý xã'}
              {user?.role === 'department_manager' && 'Quản lý sở'}
              {user?.role === 'admin' && 'Quản lý hệ thống'} */}
              Sở Giáo Dục Và Đào Tạo Đắk Lắk
            </p>
            {/* Live Load Statistics */}
            <div className="hidden lg:block">
              <LiveLoadStatsComponent compact={true} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 lg:gap-4">
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
            onClick={handleLogout}
            className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm lg:text-base hidden sm:inline">{t('auth.logout')}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;