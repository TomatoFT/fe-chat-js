import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  FileText, 
  Users, 
  GraduationCap, 
  BookOpen,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentUploadSchema, type DocumentUploadInput } from '../../lib/validations';
import { 
  useUploadDocument, 
  useUploadStaffDocument, 
  useUploadStudentsDocument, 
  useUploadExaminationsDocument 
} from '../../hooks/useDocuments';
import { useLanguage } from '../../context/LanguageContext';

interface SimpleDocumentUploadModalProps {
  uploadType: 'general' | 'staff' | 'students' | 'examinations';
  onClose: () => void;
  onSuccess: () => void;
  onError?: (error: any) => void;
}

export const SimpleDocumentUploadModal: React.FC<SimpleDocumentUploadModalProps> = ({
  uploadType,
  onClose,
  onSuccess,
  onError,
}) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const uploadDocument = useUploadDocument();
  const uploadStaffDocument = useUploadStaffDocument();
  const uploadStudentsDocument = useUploadStudentsDocument();
  const uploadExaminationsDocument = useUploadExaminationsDocument();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<DocumentUploadInput>({
    resolver: zodResolver(documentUploadSchema),
    mode: 'onChange',
  });

  const getUploadConfig = () => {
    switch (uploadType) {
      case 'staff':
        return {
          title: 'Tải lên dữ liệu nhân viên',
          description: 'Tải lên dữ liệu liên quan đến quản lý nhân viên.',
          icon: <Users className="w-8 h-8 text-green-500" />,
          color: 'green',
          hook: uploadStaffDocument,
        };
      case 'students':
        return {
          title: 'Tải lên dữ liệu học sinh',
          description: 'Tải lên dữ liệu liên quan đến hồ sơ học sinh.',
          icon: <GraduationCap className="w-8 h-8 text-purple-500" />,
          color: 'purple',
          hook: uploadStudentsDocument,
        };
      case 'examinations':
        return {
          title: 'Tải lên dữ liệu thi cử',
          description: 'Tải lên dữ liệu liên quan đến thi cử.',
          icon: <BookOpen className="w-8 h-8 text-orange-500" />,
          color: 'orange',
          hook: uploadExaminationsDocument,
        };
      default:
        return {
          title: 'Tải lên dữ liệu',
          description: 'Tải lên dữ liệu chung.',
          icon: <FileText className="w-8 h-8 text-blue-500" />,
          color: 'blue',
          hook: uploadDocument,
        };
    }
  };

  const config = getUploadConfig();
  const uploadHook = config.hook;

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.size > maxSize) {
      return 'Kích thước tệp phải nhỏ hơn 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ hỗ trợ tệp Excel XLSX';
    }

    return null;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
      } else {
        setUploadError(null);
        setSelectedFile(file);
        setValue('file', file);
      }
    }
  }, [setValue]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
      } else {
        setUploadError(null);
        setSelectedFile(file);
        setValue('file', file);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSubmit = async (data: DocumentUploadInput) => {
    setUploadError(null);
    
    // Manual file validation since we're not using form validation for the file
    if (!selectedFile) {
      setUploadError('Vui lòng chọn tệp để tải lên');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      
      await uploadHook.mutateAsync(formData);
      reset();
      setSelectedFile(null);
      onSuccess();
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Upload failed. Please try again.';
      setUploadError(errorMessage);
      onError?.(error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive
                  ? `border-${config.color}-500 bg-${config.color}-50`
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".xlsx"
              />
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedFile ? t('documents.fileSelected') : t('documents.dropFileHere')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedFile 
                      ? `${selectedFile.name} (${formatFileSize(selectedFile.size)})`
                      : t('documents.clickToBrowse')
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('documents.supportsExcel')}
                  </p>
                </div>
              </div>
            </div>


            {/* Selected File Display */}
            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title={t('documents.removeFile')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                {t('documents.documentTitleOptional')}
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('documents.enterTitle')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Document Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t('documents.descriptionOptional')}
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('documents.enterDescription')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{uploadError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={uploadHook.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || uploadHook.isPending || !!uploadError}
                className={`px-6 py-2 bg-${config.color}-500 text-white rounded-lg hover:bg-${config.color}-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {uploadHook.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('documents.uploading')}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {t('documents.uploadDocument')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
