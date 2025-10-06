import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  FileText, 
  Users, 
  GraduationCap, 
  BookOpen,
  AlertCircle,
  Loader2,
  File,
  Image,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  Archive,
  Trash2,
  Plus
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

interface DocumentUploadModalProps {
  uploadType: 'general' | 'staff' | 'students' | 'examinations';
  onClose: () => void;
  onSuccess: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  uploadType,
  onClose,
  onSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  });


  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/zip',
      'application/x-rar-compressed'
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload DOC, DOCX, TXT, XLS, XLSX, JPG, PNG, GIF, ZIP, or RAR files';
    }

    return null;
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes('sheet') || type.includes('excel')) return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    if (type.includes('image')) return <Image className="w-5 h-5 text-purple-500" />;
    if (type.includes('video')) return <FileVideo className="w-5 h-5 text-orange-500" />;
    if (type.includes('audio')) return <FileAudio className="w-5 h-5 text-pink-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5 text-yellow-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const getUploadConfig = () => {
    switch (uploadType) {
      case 'staff':
        return {
          title: 'Tải lên tài liệu nhân viên',
          description: 'Tải lên tài liệu liên quan đến quản lý nhân viên, hồ sơ và hành chính.',
          icon: <Users className="w-8 h-8 text-green-500" />,
          color: 'green',
          hook: uploadStaffDocument,
        };
      case 'students':
        return {
          title: 'Tải lên tài liệu học sinh',
          description: 'Tải lên tài liệu liên quan đến hồ sơ học sinh, tuyển sinh và tiến độ học tập.',
          icon: <GraduationCap className="w-8 h-8 text-purple-500" />,
          color: 'purple',
          hook: uploadStudentsDocument,
        };
      case 'examinations':
        return {
          title: 'Tải lên tài liệu thi cử',
          description: 'Tải lên tài liệu liên quan đến thi cử, đánh giá và kết quả kiểm tra.',
          icon: <BookOpen className="w-8 h-8 text-orange-500" />,
          color: 'orange',
          hook: uploadExaminationsDocument,
        };

    }
  };

  const config = getUploadConfig();
  const uploadHook = config?.hook;

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      files.forEach(file => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        setUploadError(errors.join('\n'));
      }

      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        if (validFiles.length === 1) {
          setValue('file', validFiles[0]);
        }
      }
    }
  }, [setValue]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      files.forEach(file => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        setUploadError(errors.join('\n'));
      }

      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        if (validFiles.length === 1) {
          setValue('file', validFiles[0]);
        }
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (newFiles.length > 0) {
        setValue('file', newFiles[0]);
      } else {
        setValue('file', undefined as any);
      }
      return newFiles;
    });
  };

  const addMoreFiles = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: DocumentUploadInput) => {
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Upload files one by one
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        if (data.title) formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        
        // Simulate progress
        setUploadProgress((i / selectedFiles.length) * 100);
        
        await uploadHook.mutateAsync(formData);
      }
      
      setUploadProgress(100);
      reset();
      setSelectedFiles([]);
      onSuccess();
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
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
            {config?.icon}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{config?.title}</h2>
              <p className="text-sm text-gray-600">{config?.description}</p>
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
                  ? `border-${config?.color}-500 bg-${config?.color}-50`
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".doc,.docx,.txt,.xlsx,.xls,.jpg,.jpeg,.png,.gif,.zip,.rar"
                multiple
              />
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Drop your files here'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedFiles.length > 0 
                      ? `Total size: ${formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0))}`
                      : 'or click to browse files'
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports DOC, DOCX, TXT, XLSX, XLS, JPG, PNG, GIF, ZIP, RAR up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {errors.file && (
              <p className="text-sm text-red-600">{errors.file.message}</p>
            )}

            {/* Selected Files List */}
            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
                    <button
                      type="button"
                      onClick={addMoreFiles}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add More
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-gray-50 rounded-lg p-3 flex items-center gap-3"
                      >
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • {file.type}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Progress */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Uploading files...</span>
                  <span className="text-gray-500">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {/* Document Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title (Optional)
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Document Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
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
                disabled={selectedFiles.length === 0 || isUploading}
                className={`px-6 py-2 bg-${config.color}-500 text-white rounded-lg hover:bg-${config.color}-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload {selectedFiles.length > 1 ? `${selectedFiles.length} Files` : 'Document'}
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
