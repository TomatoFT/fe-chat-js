import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Users, 
  GraduationCap, 
  BookOpen,
  ArrowLeft,
  Settings,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../utils/userUtils';
import { DocumentUploadModal } from './DocumentUploadModal';
import { Link } from 'react-router-dom';

interface DocumentUploadPageProps {
  className?: string;
}

export const DocumentUploadPage: React.FC<DocumentUploadPageProps> = ({ 
  className = '' 
}) => {
  const { user } = useAuth();
  const [selectedUploadType, setSelectedUploadType] = useState<'general' | 'staff' | 'students' | 'examinations' | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Role-based access control
  const canUploadGeneral = hasPermission(user, 'upload_general_documents');
  const canUploadStaff = hasPermission(user, 'upload_staff_documents');
  const canUploadStudents = hasPermission(user, 'upload_students_documents');
  const canUploadExaminations = hasPermission(user, 'upload_examinations_documents');

  const uploadTypes = [
    {
      id: 'general',
      name: 'General Documents',
      description: 'Upload general documents for your organization',
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      color: 'blue',
      available: canUploadGeneral,
    },
    {
      id: 'staff',
      name: 'Staff Documents',
      description: 'Upload staff management and administration documents',
      icon: <Users className="w-8 h-8 text-green-500" />,
      color: 'green',
      available: canUploadStaff,
    },
    {
      id: 'students',
      name: 'Student Documents',
      description: 'Upload student records and academic documents',
      icon: <GraduationCap className="w-8 h-8 text-purple-500" />,
      color: 'purple',
      available: canUploadStudents,
    },
    {
      id: 'examinations',
      name: 'Examination Documents',
      description: 'Upload examination and assessment documents',
      icon: <BookOpen className="w-8 h-8 text-orange-500" />,
      color: 'orange',
      available: canUploadExaminations,
    },
  ];

  const handleUploadTypeSelect = (type: 'general' | 'staff' | 'students' | 'examinations') => {
    setSelectedUploadType(type);
  };

  const handleBackToSelection = () => {
    setSelectedUploadType(null);
  };

  const handleQuickUpload = (type: 'general' | 'staff' | 'students' | 'examinations') => {
    setSelectedUploadType(type);
    setShowModal(true);
  };

  if (selectedUploadType) {
    return (
      <div className={`p-6 ${className}`}>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToSelection}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload Types
          </button>
          
          <div className="flex items-center gap-4">
            {uploadTypes.find(t => t.id === selectedUploadType)?.icon}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {uploadTypes.find(t => t.id === selectedUploadType)?.name}
              </h1>
              <p className="text-gray-600">
                {uploadTypes.find(t => t.id === selectedUploadType)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Upload Component */}
        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Interface</h3>
          <p className="text-gray-600 mb-6">Enhanced upload functionality coming soon...</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Use Quick Upload
          </button>
        </div>

        {/* Quick Upload Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto"
          >
            <Settings className="w-4 h-4" />
            Advanced Upload Options
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Document Upload</h1>
        <p className="text-xl text-gray-600 mb-6">
          Choose the type of documents you want to upload
        </p>
        
        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            to="/documents"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View All Documents
          </Link>
        </div>
      </div>

      {/* Upload Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {uploadTypes.map((type) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: uploadTypes.indexOf(type) * 0.1 }}
            className={`relative bg-white rounded-xl border-2 p-6 text-center transition-all duration-200 ${
              type.available
                ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg cursor-pointer'
                : 'border-gray-100 opacity-50 cursor-not-allowed'
            }`}
            onClick={() => type.available && handleUploadTypeSelect(type.id as any)}
            whileHover={type.available ? { scale: 1.02 } : {}}
            whileTap={type.available ? { scale: 0.98 } : {}}
          >
            {!type.available && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Info className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              {type.icon}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {type.name}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              {type.description}
            </p>
            
            {type.available ? (
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Tải lên tài liệu
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickUpload(type.id as any);
                  }}
                  className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Quick Upload
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Not available for your role
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Upload Guidelines */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Upload Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Supported File Types:</h4>
              <ul className="space-y-1">
                <li>• Word documents (.doc, .docx)</li>
                <li>• Excel spreadsheets (.xls, .xlsx)</li>
                <li>• Text files (.txt)</li>
                <li>• Images (.jpg, .png, .gif)</li>
                <li>• Archives (.zip, .rar)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">File Requirements:</h4>
              <ul className="space-y-1">
                <li>• Maximum file size: 10MB</li>
                <li>• Multiple files supported</li>
                <li>• Drag and drop interface</li>
                <li>• Progress tracking</li>
                <li>• Error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && selectedUploadType && (
        <DocumentUploadModal
          uploadType={selectedUploadType}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
