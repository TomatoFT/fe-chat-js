import React, { useState } from 'react';
import { useDocuments, useDeleteDocument } from '../../hooks/useDocuments';
import { useAuth } from '../../context/AuthContext';

export const DocumentList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  
  const { data: documents, isLoading, error } = useDocuments();
  
  const deleteDocument = useDeleteDocument();

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument.mutateAsync(documentId);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">Error loading documents: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder={t('documents.searchDocuments')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Documents List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {!Array.isArray(documents) || documents.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              {searchTerm ? 'No documents found matching your search.' : 'No documents found.'}
            </li>
          ) : (
            documents.map((document: any) => (
              <li key={document.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">📄</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {document.title || document.filename || 'Untitled Document'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {document.description || 'No description'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(document.created_at).toLocaleDateString()} • 
                        {document.file_size ? ` ${(document.file_size / 1024).toFixed(1)} KB` : ''} • 
                        Status: {document.status || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {document.download_url && (
                      <a
                        href={document.download_url}
                        download
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Download
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                      disabled={deleteDocument.isPending}
                    >
                      {deleteDocument.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Pagination */}
      {Array.isArray(documents) && documents.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {documents.length} documents
          </div>
        </div>
      )}
    </div>
  );
};
