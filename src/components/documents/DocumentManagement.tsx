import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Users,
  GraduationCap,
  BookOpen,
  File,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  useDownloadExampleStaffDocument,
  useDownloadExampleStudentsDocument,
  useDownloadExampleExaminationsDocument
} from '../../hooks/useDocuments';
import { hasPermission } from '../../utils/userUtils';
import { SimpleDocumentUploadModal } from './SimpleDocumentUploadModal';

interface DocumentManagementProps {
  className?: string;
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'general' | 'staff' | 'students' | 'examinations'>('general');
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    message: ''
  });

  const downloadExampleStaff = useDownloadExampleStaffDocument();
  const downloadExampleStudents = useDownloadExampleStudentsDocument();
  const downloadExampleExaminations = useDownloadExampleExaminationsDocument();

  // Role-based access control using utility functions
  const canUploadStaff = hasPermission(user, 'upload_staff_documents');
  const canUploadStudents = hasPermission(user, 'upload_students_documents');
  const canUploadExaminations = hasPermission(user, 'upload_examinations_documents');

  const handleUpload = (type: 'general' | 'staff' | 'students' | 'examinations') => {
    console.log('Upload button clicked for type:', type);
    setUploadType(type);
    setShowUploadModal(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setNotification({
      show: true,
      type: 'success',
      message: 'Tài liệu đã được tải lên thành công!'
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleUploadError = (error: any) => {
    setNotification({
      show: true,
      type: 'error',
      message: error.message || 'Có lỗi xảy ra khi tải lên tài liệu'
    });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleDownloadExample = async (type: 'staff' | 'students' | 'examinations') => {
    try {
      let blob;
      let filename;
      
      switch (type) {
        case 'staff':
          blob = await downloadExampleStaff.mutateAsync();
          filename = 'example_staff_document.xlsx';
          break;
        case 'students':
          blob = await downloadExampleStudents.mutateAsync();
          filename = 'example_students_document.xlsx';
          break;
        case 'examinations':
          blob = await downloadExampleExaminations.mutateAsync();
          filename = 'example_examinations_document.xlsx';
          break;
        default:
          throw new Error('Invalid example type');
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Example download failed:', error);
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* Success/Error Notification */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tài liệu</h1>
            <p className="text-gray-600">Tải lên tài liệu Excel cho hệ thống</p>
          </div>
        </div>
      </div>

      {/* Upload Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tải lên tài liệu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {canUploadStaff && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUpload('staff')}
              className="flex flex-col items-center gap-3 p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <Users className="w-8 h-8 text-green-600" />
              <div className="text-center">
                <h3 className="font-semibold text-green-900">Tài liệu nhân viên</h3>
                <p className="text-sm text-green-700">Tải lên danh sách nhân viên</p>
              </div>
            </motion.button>
          )}
          
          {canUploadStudents && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUpload('students')}
              className="flex flex-col items-center gap-3 p-6 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <div className="text-center">
                <h3 className="font-semibold text-purple-900">Tài liệu học sinh</h3>
                <p className="text-sm text-purple-700">Tải lên danh sách học sinh</p>
              </div>
            </motion.button>
          )}
          
          {canUploadExaminations && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUpload('examinations')}
              className="flex flex-col items-center gap-3 p-6 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <BookOpen className="w-8 h-8 text-orange-600" />
              <div className="text-center">
                <h3 className="font-semibold text-orange-900">Tài liệu thi cử</h3>
                <p className="text-sm text-orange-700">Tải lên kết quả thi cử</p>
              </div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Example Downloads */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <File className="w-5 h-5 text-gray-600" />
            Tải xuống mẫu tài liệu
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tải xuống các tệp mẫu để tham khảo định dạng dữ liệu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownloadExample('staff')}
              disabled={downloadExampleStaff.isPending}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {downloadExampleStaff.isPending ? 'Đang tải...' : 'Mẫu nhân viên'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownloadExample('students')}
              disabled={downloadExampleStudents.isPending}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {downloadExampleStudents.isPending ? 'Đang tải...' : 'Mẫu học sinh'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownloadExample('examinations')}
              disabled={downloadExampleExaminations.isPending}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {downloadExampleExaminations.isPending ? 'Đang tải...' : 'Mẫu thi cử'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-blue-900 mb-2">Hệ thống tài liệu</h3>
        <p className="text-blue-700">
          Tài liệu của bạn sẽ được xử lý và lưu trữ an toàn. 
          Bạn có thể sử dụng chúng để tương tác với AI Assistant.
        </p>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <SimpleDocumentUploadModal
          uploadType={uploadType}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
        />
      )}
    </div>
  );
};
