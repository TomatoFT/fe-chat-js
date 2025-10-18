import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentUploadSchema, type DocumentUploadInput } from '../../lib/validations';
import { 
  useUploadDocument, 
  useUploadStaffDocument, 
  useUploadStudentsDocument, 
  useUploadExaminationsDocument 
} from '../../hooks/useDocuments';

interface DocumentUploadProps {
  uploadType?: 'general' | 'staff' | 'students' | 'examinations';
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  uploadType = 'general',
  onSuccess,
  onError,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Use the appropriate upload hook based on uploadType
  const uploadDocument = useUploadDocument();
  const uploadStaffDocument = useUploadStaffDocument();
  const uploadStudentsDocument = useUploadStudentsDocument();
  const uploadExaminationsDocument = useUploadExaminationsDocument();

  // Get the correct upload function based on type
  const getUploadFunction = () => {
    switch (uploadType) {
      case 'staff':
        return uploadStaffDocument;
      case 'students':
        return uploadStudentsDocument;
      case 'examinations':
        return uploadExaminationsDocument;
      default:
        return uploadDocument;
    }
  };

  const uploadFunction = getUploadFunction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<DocumentUploadInput>({
    resolver: zodResolver(documentUploadSchema),
  });

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
      setSelectedFile(file);
      setValue('file', file);
    }
  }, [setValue]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setValue('file', file);
    }
  };

  const onSubmit = async (data: DocumentUploadInput) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      
      await uploadFunction.mutateAsync(formData);
      reset();
      setSelectedFile(null);
      onSuccess?.();
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error);
    }
  };

  const getUploadTitle = () => {
    switch (uploadType) {
      case 'staff':
        return 'Tải lên tài liệu nhân viên';
      case 'students':
        return 'Tải lên tài liệu học sinh';
      case 'examinations':
        return 'Tải lên tài liệu thi cử';
      default:
        return 'Tải lên tài liệu';
    }
  };

  const getUploadDescription = () => {
    switch (uploadType) {
      case 'staff':
        return 'Tải lên tài liệu liên quan đến nhân viên';
      case 'students':
        return 'Tải lên tài liệu liên quan đến học sinh';
      case 'examinations':
        return 'Tải lên tài liệu liên quan đến thi cử';
      default:
        return 'Tải lên bất kỳ tài liệu nào';
    }
  };

  const isUploading = uploadFunction.isPending;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{getUploadTitle()}</h2>
        <p className="text-gray-600 mb-6">{getUploadDescription()}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              {...register('file')}
              type="file"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".doc,.docx,.txt,.xlsx,.xls"
            />
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Nhấp để tải lên
                </span>{' '}
                hoặc kéo thả
              </div>
              <p className="text-xs text-gray-500">DOC, DOCX, TXT, XLSX, XLS tối đa 10MB</p>
            </div>
          </div>

          {selectedFile && (
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-900">{selectedFile.name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            </div>
          )}

          {errors.file && (
            <p className="text-sm text-red-600">{errors.file.message}</p>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Tiêu đề (Tùy chọn)
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Nhập tiêu đề tài liệu"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả (Tùy chọn)
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Nhập mô tả tài liệu"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Đang tải lên...' : 'Tải lên tài liệu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
