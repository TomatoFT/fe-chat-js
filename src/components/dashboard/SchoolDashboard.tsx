import React from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import ChatInterface from '../chat/ChatInterface';

const SchoolDashboard: React.FC = () => {
  return (
    <div className="h-full">
      {/* Quick Actions Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600">Ask questions about your uploaded documents</p>
          </div>
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <Upload className="w-4 h-4" />
            Manage Documents
          </Link>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default SchoolDashboard;