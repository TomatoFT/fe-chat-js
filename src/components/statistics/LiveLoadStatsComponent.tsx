import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, GraduationCap, BookOpen, TrendingUp, Activity } from 'lucide-react';
import { useLiveLoadStats } from '../../hooks/useLiveLoadStats';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
  >
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  </motion.div>
);

export const LiveLoadStatsComponent: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { data: stats, isLoading, error } = useLiveLoadStats();

  if (isLoading) {
    return (
      <div className={`${compact ? 'flex space-x-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-pulse ${compact ? 'min-w-[120px]' : ''}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-red-500" />
          <p className="text-red-700">Không thể tải thống kê</p>
        </div>
      </div>
    );
  }

  if (!stats?.stats) {
    return null;
  }

  const { role, stats: statsData } = stats;

  // Define stat configurations based on role
  const getStatConfigs = () => {
    const configs: Array<{
      key: string;
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      color: string;
    }> = [];

    switch (role) {
      case 'school_manager':
        if (statsData.students !== undefined) {
          configs.push({
            key: 'students',
            icon: GraduationCap,
            label: 'Học sinh',
            color: 'bg-blue-500'
          });
        }
        if (statsData.staffs !== undefined) {
          configs.push({
            key: 'staffs',
            icon: Users,
            label: 'Nhân viên',
            color: 'bg-green-500'
          });
        }
        break;

      case 'province_manager':
        if (statsData.schools !== undefined) {
          configs.push({
            key: 'schools',
            icon: Building2,
            label: 'Trường học',
            color: 'bg-purple-500'
          });
        }
        if (statsData.students !== undefined) {
          configs.push({
            key: 'students',
            icon: GraduationCap,
            label: 'Học sinh',
            color: 'bg-blue-500'
          });
        }
        if (statsData.staffs !== undefined) {
          configs.push({
            key: 'staffs',
            icon: Users,
            label: 'Nhân viên',
            color: 'bg-green-500'
          });
        }
        break;

      case 'department_manager':
        if (statsData.provinces !== undefined) {
          configs.push({
            key: 'provinces',
            icon: TrendingUp,
            label: 'Tỉnh/Thành phố',
            color: 'bg-indigo-500'
          });
        }
        if (statsData.schools !== undefined) {
          configs.push({
            key: 'schools',
            icon: Building2,
            label: 'Trường học',
            color: 'bg-purple-500'
          });
        }
        if (statsData.students !== undefined) {
          configs.push({
            key: 'students',
            icon: GraduationCap,
            label: 'Học sinh',
            color: 'bg-blue-500'
          });
        }
        if (statsData.staffs !== undefined) {
          configs.push({
            key: 'staffs',
            icon: Users,
            label: 'Nhân viên',
            color: 'bg-green-500'
          });
        }
        break;

      default:
        // Show all available stats
        Object.entries(statsData).forEach(([key, value]) => {
          if (typeof value === 'number') {
            let icon = BookOpen;
            let label = key;
            let color = 'bg-gray-500';

            switch (key) {
              case 'students':
                icon = GraduationCap;
                label = 'Học sinh';
                color = 'bg-blue-500';
                break;
              case 'staffs':
                icon = Users;
                label = 'Nhân viên';
                color = 'bg-green-500';
                break;
              case 'schools':
                icon = Building2;
                label = 'Trường học';
                color = 'bg-purple-500';
                break;
              case 'provinces':
                icon = TrendingUp;
                label = 'Tỉnh/Thành phố';
                color = 'bg-indigo-500';
                break;
            }

            configs.push({ key, icon, label, color });
          }
        });
    }

    return configs;
  };

  const statConfigs = getStatConfigs();

  if (statConfigs.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex space-x-3">
        {statConfigs.slice(0, 3).map((config, index) => (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200"
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${config.color}`}>
              <config.icon className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{statsData[config.key]?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-600">{config.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Thống kê trực tiếp</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statConfigs.map((config, index) => (
          <StatCard
            key={config.key}
            icon={config.icon}
            label={config.label}
            value={statsData[config.key] || 0}
            color={config.color}
            delay={index}
          />
        ))}
      </div>
    </div>
  );
};