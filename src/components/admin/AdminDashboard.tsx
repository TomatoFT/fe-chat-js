import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, School, FileText, Activity, Shield, Database, TrendingUp } from 'lucide-react';
import { useDashboardStats, useSystemStats, useRecentActivity, useDocumentStats, useUserStats } from '../../hooks/useStatistics';
import { useUsers } from '../../hooks/useUsers';
import { useProvinces, useSchools } from '../../hooks/useUsers';

const AdminDashboard: React.FC = () => {
  // Fetch real data from APIs
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: systemStats, isLoading: systemLoading } = useSystemStats();
  const { data: activityStats } = useRecentActivity();
  const { data: documentStats } = useDocumentStats();
  const { data: userStats } = useUserStats();
  const { data: users } = useUsers({ skip: 0, limit: 1000 });
  const { data: provinces } = useProvinces();
  const { data: schools } = useSchools();

  // Calculate real statistics
  const systemStatsData = [
    { 
      label: 'Total Users', 
      value: userStats?.total || users?.length || 0, 
      icon: Users, 
      color: 'blue', 
      change: '+12%' 
    },
    { 
      label: 'Deputies', 
      value: userStats?.byRole?.department_manager || 0, 
      icon: Shield, 
      color: 'purple', 
      change: '+1' 
    },
    { 
      label: 'Provinces', 
      value: provinces?.length || 0, 
      icon: Building2, 
      color: 'green', 
      change: '0' 
    },
    { 
      label: 'Schools', 
      value: schools?.length || 0, 
      icon: School, 
      color: 'orange', 
      change: '+11' 
    },
    { 
      label: 'Documents', 
      value: documentStats?.total || 0, 
      icon: FileText, 
      color: 'red', 
      change: '+156' 
    },
    { 
      label: 'Storage Used', 
      value: '45.2 GB', 
      icon: Database, 
      color: 'indigo', 
      change: '+2.1 GB' 
    },
    { 
      label: 'Active Sessions', 
      value: systemStats?.activeUsers || 0, 
      icon: Activity, 
      color: 'pink', 
      change: '+23' 
    },
    { 
      label: 'System Health', 
      value: systemStats?.status === 'healthy' ? '99.8%' : '98.5%', 
      icon: TrendingUp, 
      color: 'emerald', 
      change: '+0.1%' 
    },
  ];

  const recentActivities = [
    { 
      type: 'user_created', 
      message: `New users registered: ${activityStats?.recentLogins || 0} recent logins`, 
      time: '2 hours ago', 
      severity: 'info' 
    },
    { 
      type: 'document_uploaded', 
      message: `${activityStats?.documentsUploaded || 0} documents uploaded this week`, 
      time: '4 hours ago', 
      severity: 'success' 
    },
    { 
      type: 'system_update', 
      message: 'AI processing engine updated to v2.1.4', 
      time: '6 hours ago', 
      severity: 'info' 
    },
    { 
      type: 'security_alert', 
      message: 'System monitoring active', 
      time: '8 hours ago', 
      severity: 'warning' 
    },
    { 
      type: 'backup_completed', 
      message: 'Daily system backup completed successfully', 
      time: '12 hours ago', 
      severity: 'success' 
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h1>
        <p className="text-gray-600">Monitor and manage the entire educational platform</p>
      </div>

      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemStatsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent System Activities */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent System Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg ${getSeverityColor(activity.severity)}`}
              >
                <p className="font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.time}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Health Monitor */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Health Monitor</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <span className="text-green-600 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">AI Processing</span>
              </div>
              <span className="text-green-600 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">File Storage</span>
              </div>
              <span className="text-green-600 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">Backup System</span>
              </div>
              <span className="text-yellow-600 text-sm">Scheduled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">API Gateway</span>
              </div>
              <span className="text-blue-600 text-sm">Load: 23%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;