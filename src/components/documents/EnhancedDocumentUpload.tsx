import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Users, 
  GraduationCap, 
  BookOpen,
  AlertCircle,
  CheckCircle,
  Loader2,
  File,
  Image,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  Archive,
  Trash2,
  Plus,
  X,
  CloudUpload,
  FolderOpen
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
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../utils/userUtils';

interface EnhancedDocumentUploadProps {
  className?: string;
}

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export const EnhancedDocumentUpload: React.FC<EnhancedDocumentUploadProps> = ({ 
  className = '' 
}) => {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
    watch,
    reset,
  } = useForm<DocumentUploadInput>({
    resolver: zodResolver(documentUploadSchema),
  });

  const title = watch('title');
  const description = watch('description');

  // Role-based access control
  const canUploadGeneral = hasPermission(user, 'upload_general_documents');
  const canUploadStaff = hasPermission(user, 'upload_staff_documents');
  const canUploadStudents = hasPermission(user, 'upload_students_documents');
  const canUploadExaminations = hasPermission(user, 'upload_examinations_documents');

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
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
      return 'File type not supported';
    }

    return null;
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes('sheet') || type.includes('excel')) return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    if (type.includes('image')) return <Image className="w-5 h-5 text-purple-500" />;
    if (type.includes('video')) return <FileVideo className="w-5 h-5 text-orange-500" />;
    if (type.includes('audio')) return <FileAudio className="w-5 h-5 text-pink-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5 text-yellow-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  // Get upload hook based on file type
  const getUploadHook = (file: File) => {
    // This is a simplified approach - in a real app, you might want to categorize files differently
    if (file.name.toLowerCase().includes('staff')) return uploadStaffDocument;
    if (file.name.toLowerCase().includes('student')) return uploadStudentsDocument;
    if (file.name.toLowerCase().includes('exam')) return uploadExaminationsDocument;
    return uploadDocument;
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    const newUploadFiles: UploadFile[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        newUploadFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending',
          progress: 0,
        });
      }
    });

    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
    }

    if (newUploadFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...newUploadFiles]);
      setUploadError(null);
    }
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== id));
  };

  const clearAllFiles = () => {
    setUploadFiles([]);
    setUploadError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFilesSequentially = async () => {
    setIsUploading(true);
    setUploadError(null);

    for (let i = 0; i < uploadFiles.length; i++) {
      const uploadFile = uploadFiles[i];
      
      // Update status to uploading
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      try {
        const uploadHook = getUploadHook(uploadFile.file);
        const formData = new FormData();
        formData.append('file', uploadFile.file);
        if (title) formData.append('title', title);
        if (description) formData.append('description', description);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id && f.status === 'uploading'
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ));
        }, 200);

        await uploadHook.mutateAsync(formData);

        clearInterval(progressInterval);

        // Update status to success
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'success', progress: 100 }
            : f
        ));

      } catch (error: any) {
        // Update status to error
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: error.message || 'Upload failed' }
            : f
        ));
      }
    }

    setIsUploading(false);
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return <File className="w-4 h-4 text-gray-400" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-500';
      case 'uploading':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
    }
  };

  const pendingFiles = uploadFiles.filter(f => f.status === 'pending');
  const uploadingFiles = uploadFiles.filter(f => f.status === 'uploading');
  const successFiles = uploadFiles.filter(f => f.status === 'success');
  const errorFiles = uploadFiles.filter(f => f.status === 'error');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600">Drag and drop files or click to browse</p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
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
          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.jpg,.jpeg,.png,.gif,.zip,.rar"
          multiple
        />
        
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <CloudUpload className="w-10 h-10 text-gray-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {uploadFiles.length > 0 ? `${uploadFiles.length} file(s) ready` : 'Drop your files here'}
            </h3>
            <p className="text-gray-600 mb-4">
              {uploadFiles.length > 0 
                ? `Total size: ${formatFileSize(uploadFiles.reduce((acc, file) => acc + file.file.size, 0))}`
                : 'or click to browse files'
              }
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOC, DOCX, TXT, XLSX, XLS, JPG, PNG, GIF, ZIP, RAR up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Files to Upload</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add More
                </button>
                <button
                  onClick={clearAllFiles}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadFiles.map((uploadFile) => (
                <motion.div
                  key={uploadFile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(uploadFile.file)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type}
                      </p>
                      {uploadFile.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {uploadFile.error && (
                        <p className="text-sm text-red-600 mt-1">{uploadFile.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getStatusColor(uploadFile.status)}`}>
                        {uploadFile.status === 'uploading' ? `${uploadFile.progress}%` : uploadFile.status}
                      </span>
                      {getStatusIcon(uploadFile.status)}
                      {uploadFile.status === 'pending' && (
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Summary */}
      {uploadFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{pendingFiles.length}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{uploadingFiles.length}</div>
              <div className="text-sm text-gray-500">Uploading</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{successFiles.length}</div>
              <div className="text-sm text-gray-500">Success</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">{errorFiles.length}</div>
              <div className="text-sm text-gray-500">Errors</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 whitespace-pre-line">{uploadError}</span>
        </div>
      )}

      {/* Action Buttons */}
      {uploadFiles.length > 0 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={uploadFilesSequentially}
            disabled={isUploading || pendingFiles.length === 0}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading {uploadingFiles.length} of {uploadFiles.length}...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload {pendingFiles.length} File{pendingFiles.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
