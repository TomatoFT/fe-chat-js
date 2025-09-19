import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, MessageSquare, FileText } from 'lucide-react';

const DeputyDashboard: React.FC = () => {
  const quickActions = [
    {
      title: 'AI Chat Assistant',
      description: 'Ask questions about educational policies and documents',
      icon: MessageSquare,
      link: '/chat',
      color: 'blue',
    },
    {
      title: 'Manage Provinces',
      description: 'Add, edit, and monitor all provinces',
      icon: Building2,
      link: '/provinces',
      color: 'indigo',
    },
    {
      title: 'View All Schools',
      description: 'Monitor schools across all provinces',
      icon: Users,
      link: '/schools',
      color: 'green',
    },
    {
      title: 'Document Management',
      description: 'Upload and manage educational documents',
      icon: FileText,
      link: '/documents',
      color: 'purple',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Deputy Dashboard</h1>
        <p className="text-gray-600">Oversee the entire educational system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={action.title}
            to={action.link}
            className="card hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* System Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Provinces</p>
              <p className="text-xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Schools</p>
              <p className="text-xl font-bold text-gray-900">127</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-xl font-bold text-gray-900">2,847</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeputyDashboard;