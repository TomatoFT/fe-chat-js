import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StudentManagement } from './StudentManagement';
import { StaffManagement } from './StaffManagement';
import { ExaminationManagement } from './ExaminationManagement';

interface SchoolManagerDashboardProps {
  className?: string;
}

export const SchoolManagerDashboard: React.FC<SchoolManagerDashboardProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'students' | 'staff' | 'examinations'>('students');


  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'staff', label: 'Staff', icon: UserCheck },
    { id: 'examinations', label: 'Examinations', icon: BookOpen },
  ];



  const renderActiveTab = () => {
    switch (activeTab) {
      case 'students':
        return <StudentManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'examinations':
        return <ExaminationManagement />;
      default:
        return <StudentManagement />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Management</h1>
          <p className="text-gray-600">Manage students, staff, and examinations for your school</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderActiveTab()}
      </motion.div>
    </div>
  );
};
