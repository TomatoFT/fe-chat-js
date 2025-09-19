import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Download, 
  Trash2, 
  FileText, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDeleteDocument, useDownloadDocument } from '../../hooks/useDocuments';

interface DocumentViewerProps {
  document: any;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDownloadDocument();

  const handleDownload = async () => {
    try {
      const blob = await downloadDocument.mutateAsync(document.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteDocument.mutateAsync(document.id);
        onClose();
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getDocumentStatus = () => {
    if (document.is_indexed) {
      return { 
        icon: <CheckCircle className="w-4 h-4 text-green-500" />, 
        text: 'Indexed and Searchable', 
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
    }
    return { 
      icon: <Clock className="w-4 h-4 text-yellow-500" />, 
      text: 'Processing', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    };
  };

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'PDF Document';
      case 'doc': case 'docx': return 'Word Document';
      case 'xls': case 'xlsx': return 'Excel Spreadsheet';
      case 'txt': return 'Text File';
      default: return 'Document';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const status = getDocumentStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {document.name || 'Untitled Document'}
              </h2>
              <p className="text-sm text-gray-600">
                {getFileType(document.name || '')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={showDetails ? 'Hide Details' : 'Show Details'}
            >
              {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Document Preview Area */}
          <div className="flex-1 p-6">
            <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
                <p className="text-gray-600 mb-4">
                  Preview functionality will be available in future updates
                </p>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                >
                  <Download className="w-4 h-4" />
                  Download to View
                </button>
              </div>
            </div>
          </div>

          {/* Document Details Sidebar */}
          {showDetails && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h3>
              
              {/* Status */}
              <div className={`${status.bgColor} rounded-lg p-4 mb-6`}>
                <div className="flex items-center gap-2 mb-2">
                  {status.icon}
                  <span className={`font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {document.is_indexed 
                    ? 'This document is indexed and can be searched using the AI chat.'
                    : 'This document is being processed and will be available for search soon.'
                  }
                </p>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Name
                  </label>
                  <p className="text-sm text-gray-900 break-words">
                    {document.name || 'Untitled Document'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Path
                  </label>
                  <p className="text-sm text-gray-600 break-words">
                    {document.file_path || 'No path available'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {getFileType(document.name || '')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(document.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {document.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Modified
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(document.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document ID
                  </label>
                  <p className="text-sm text-gray-600 font-mono">
                    {document.id}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Document
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Document'}
                </button>
              </div>

              {/* Warning */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">
                      Important Note
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Deleting this document will remove it permanently from the system and it will no longer be available for AI chat searches.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
