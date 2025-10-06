import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  File,
  AlertCircle,
  CheckCircle,
  Clock,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  useDocuments, 
  useDeleteDocument, 
  useDownloadDocument,
  useDownloadExampleStaffDocument,
  useDownloadExampleStudentsDocument,
  useDownloadExampleExaminationsDocument
} from '../../hooks/useDocuments';
import { hasPermission } from '../../utils/userUtils';
import { SimpleDocumentUploadModal } from './SimpleDocumentUploadModal';
import { DocumentViewer } from './DocumentViewer';

interface DocumentManagementProps {
  className?: string;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'general' | 'staff' | 'students' | 'examinations'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'general' | 'staff' | 'students' | 'examinations'>('general');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showViewer, setShowViewer] = useState(false);

  const { data: documents, isLoading, error } = useDocuments();
  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDownloadDocument();
  const downloadExampleStaff = useDownloadExampleStaffDocument();
  const downloadExampleStudents = useDownloadExampleStudentsDocument();
  const downloadExampleExaminations = useDownloadExampleExaminationsDocument();

  // Role-based access control using utility functions
  const canUploadGeneral = hasPermission(user, 'upload_general_documents');
  const canUploadStaff = hasPermission(user, 'upload_staff_documents');
  const canUploadStudents = hasPermission(user, 'upload_students_documents');
  const canUploadExaminations = hasPermission(user, 'upload_examinations_documents');

  // Debug logging
  console.log('User:', user);
  console.log('Permissions:', {
    canUploadGeneral,
    canUploadStaff,
    canUploadStudents,
    canUploadExaminations
  });

  const filteredDocuments = (documents || []).filter((doc: any) => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.file_path?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    
    // Map document types based on file path or name patterns
    const docType = getDocumentType(doc);
    return matchesSearch && docType === filterType;
  });

  const getDocumentType = (doc: any): string => {
    const path = doc.file_path?.toLowerCase() || '';
    const name = doc.name?.toLowerCase() || '';
    
    if (path.includes('staff') || name.includes('staff')) return 'staff';
    if (path.includes('students') || name.includes('students')) return 'students';
    if (path.includes('examinations') || name.includes('examinations')) return 'examinations';
    return 'general';
  };

  const getDocumentIcon = (doc: any) => {
    const type = getDocumentType(doc);
    switch (type) {
      case 'staff': return <Users className="w-5 h-5 text-blue-500" />;
      case 'students': return <GraduationCap className="w-5 h-5 text-green-500" />;
      case 'examinations': return <BookOpen className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDocumentStatus = (doc: any) => {
    if (doc.is_indexed) {
      return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: 'Indexed', color: 'text-green-600' };
    }
    return { icon: <Clock className="w-4 h-4 text-yellow-500" />, text: 'Processing', color: 'text-yellow-600' };
  };

  const handleUpload = (type: 'general' | 'staff' | 'students' | 'examinations') => {
    console.log('Upload button clicked for type:', type);
    setUploadType(type);
    setShowUploadModal(true);
  };

  const handleView = (doc: any) => {
    setSelectedDocument(doc);
    setShowViewer(true);
  };

  const handleDownload = async (doc: any) => {
    try {
      const blob = await downloadDocument.mutateAsync(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (doc: any) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument.mutateAsync(doc.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
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

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">Failed to load documents. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tài liệu</h1>
            <p className="text-gray-600">Tải lên, quản lý và tổ chức tài liệu của bạn</p>
          </div>
        </div>
      </div>

      {/* Upload Actions */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">image.png
          {canUploadStaff && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUpload('staff')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <Users className="w-4 h-4" />
{t('documents.uploadStaffDocument')}
            </motion.button>
          )}
          
          {canUploadStudents && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUpload('students')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <GraduationCap className="w-4 h-4" />
{t('documents.uploadStudentsDocument')}
            </motion.button>
          )}
          
          {canUploadExaminations && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUpload('examinations')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <BookOpen className="w-4 h-4" />
{t('documents.uploadExaminationsDocument')}
            </motion.button>
          )}
        </div>
      </div>

      {/* Example Downloads */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <File className="w-5 h-5 text-gray-600" />
{t('documents.exampleDocuments')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
{t('documents.exampleDescription')}
          </p>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownloadExample('staff')}
              disabled={downloadExampleStaff.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
{downloadExampleStaff.isPending ? t('documents.downloading') : t('documents.staffTemplate')}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownloadExample('students')}
              disabled={downloadExampleStudents.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
{downloadExampleStudents.isPending ? t('documents.downloading') : t('documents.studentsTemplate')}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownloadExample('examinations')}
              disabled={downloadExampleExaminations.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
{downloadExampleExaminations.isPending ? t('documents.downloading') : t('documents.examinationsTemplate')}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('documents.searchDocuments')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t('documents.allTypes')}</option>
            <option value="general">{t('documents.general')}</option>
            <option value="staff">{t('documents.staff')}</option>
            <option value="students">{t('documents.students')}</option>
            <option value="examinations">{t('documents.examinations')}</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc: any, index: number) => {
          const status = getDocumentStatus(doc);
          
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getDocumentIcon(doc)}
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {doc.name || 'Untitled Document'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {status.icon}
                  <span className={`text-xs ${status.color}`}>
                    {status.text}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 truncate">
                  {doc.file_path || 'No path available'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(doc)}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    title={t('documents.view')}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                    title={t('documents.download')}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title={t('documents.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <span className="text-xs text-gray-400 uppercase">
                  {getDocumentType(doc)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first document to get started'
            }
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <SimpleDocumentUploadModal
          uploadType={uploadType}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => setShowUploadModal(false)}
        />
      )}

      {/* Document Viewer */}
      {showViewer && selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
};
