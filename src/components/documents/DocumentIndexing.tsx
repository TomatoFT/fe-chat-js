import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileText,
  Database,
  Search,
  BarChart3
} from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import { useAuth } from '../../context/AuthContext';

interface DocumentIndexingProps {
  className?: string;
}

export const DocumentIndexing: React.FC<DocumentIndexingProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingProgress, setIndexingProgress] = useState(0);
  const [indexingStatus, setIndexingStatus] = useState<'idle' | 'indexing' | 'completed' | 'error'>('idle');
  const [indexingMessage, setIndexingMessage] = useState('');

  const { data: documents, isLoading, error } = useDocuments();

  // Only allow admins to access this component
  if (user?.role !== 'admin') {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">Access denied. This feature is only available to administrators.</span>
        </div>
      </div>
    );
  }

  const handleReindexAll = async () => {
    setIsIndexing(true);
    setIndexingStatus('indexing');
    setIndexingProgress(0);
    setIndexingMessage('Starting document indexing...');

    try {
      // Simulate indexing progress
      const progressInterval = setInterval(() => {
        setIndexingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // Make API call to reindex all documents
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://157.10.52.80:8000'}/documents/indexing/reindex-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reindex documents');
      }

      clearInterval(progressInterval);
      setIndexingProgress(100);
      setIndexingStatus('completed');
      setIndexingMessage('All documents have been successfully indexed!');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIndexingStatus('idle');
        setIndexingProgress(0);
        setIndexingMessage('');
      }, 3000);

    } catch (error) {
      console.error('Indexing error:', error);
      setIndexingStatus('error');
      setIndexingMessage('Failed to index documents. Please try again.');
    } finally {
      setIsIndexing(false);
    }
  };

  const indexedDocuments = documents?.filter((doc: any) => doc.is_indexed) || [];
  const unindexedDocuments = documents?.filter((doc: any) => !doc.is_indexed) || [];
  const totalDocuments = documents?.length || 0;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Indexing</h1>
        <p className="text-gray-600">Manage document indexing for AI search functionality</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Indexed Documents</p>
              <p className="text-2xl font-bold text-green-600">{indexedDocuments.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Indexing</p>
              <p className="text-2xl font-bold text-yellow-600">{unindexedDocuments.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Indexing Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Indexing Actions</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Reindex All Documents</h3>
              <p className="text-sm text-gray-600">
                Reindex all documents in the system to ensure search accuracy
              </p>
            </div>
            <button
              onClick={handleReindexAll}
              disabled={isIndexing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isIndexing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Indexing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reindex All
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {isIndexing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Indexing Progress</span>
                <span>{Math.round(indexingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${indexingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-600">{indexingMessage}</p>
            </div>
          )}

          {/* Status Messages */}
          {indexingStatus === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">{indexingMessage}</span>
            </div>
          )}

          {indexingStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{indexingMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Document Status List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Document Status</h2>
          <p className="text-sm text-gray-600">View the indexing status of all documents</p>
        </div>

        <div className="divide-y divide-gray-200">
          {documents?.map((doc: any, index: number) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {doc.name || 'Untitled Document'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {doc.is_indexed ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Indexed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {documents?.length === 0 && (
          <div className="p-8 text-center">
            <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500">Upload some documents to get started with indexing.</p>
          </div>
        )}
      </div>
    </div>
  );
};
