import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, Search, Brain, Eye, Download, Trash2, Filter } from 'lucide-react';
import { Document } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const DocumentsManager: React.FC = () => {
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [processingStages, setProcessingStages] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'processing' | 'ready' | 'error'>('all');
  const [viewMode, setViewMode] = useState<'upload' | 'manage'>('upload');

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
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    for (const file of validFiles) {
      const newDoc: Document = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedBy: 'current-user',
        schoolId: 'school-1',
        uploadedAt: new Date().toISOString(),
        status: 'processing',
      };

      setDocuments(prev => [...prev, newDoc]);

      // Simulate advanced processing with stages
      setProcessingStages(prev => ({ ...prev, [newDoc.id]: 'extracting' }));
      
      setTimeout(() => {
        setProcessingStages(prev => ({ ...prev, [newDoc.id]: 'indexing' }));
      }, 1000);
      
      setTimeout(() => {
        setProcessingStages(prev => ({ ...prev, [newDoc.id]: 'optimizing' }));
      }, 2000);
      
      setTimeout(() => {
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === newDoc.id ? { ...doc, status: 'ready' } : doc
          )
        );
        setProcessingStages(prev => {
          const newStages = { ...prev };
          delete newStages[newDoc.id];
          return newStages;
        });
      }, 2000 + Math.random() * 3000);
    }

    setUploading(false);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('sheet')) return '📊';
    return '📄';
  };

  const getProcessingStageInfo = (stage: string) => {
    switch (stage) {
      case 'extracting':
        return { icon: FileText, text: 'Extracting text...', color: 'blue' };
      case 'indexing':
        return { icon: Search, text: 'Creating search index...', color: 'purple' };
      case 'optimizing':
        return { icon: Brain, text: 'Optimizing for AI...', color: 'green' };
      default:
        return { icon: Loader2, text: 'Processing...', color: 'blue' };
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('documents.manager')}</h1>
        <p className="text-gray-600">
          {t('documents.uploadAndManage')}
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            onClick={() => setViewMode('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'upload'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            {t('documents.uploadDocuments')}
          </button>
          <button
            onClick={() => setViewMode('manage')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'manage'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            {t('documents.manageDocuments')} ({documents.length})
          </button>
        </div>
      </div>

      {viewMode === 'upload' ? (
        <>
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
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
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('documents.dropFiles')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('documents.supportedFormats')}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
                disabled={uploading}
              >
                {uploading ? t('documents.uploading') : t('documents.chooseFiles')}
              </motion.button>
            </div>
          </div>

          {/* Recent Uploads */}
          {documents.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('documents.recentUploads')} ({documents.length})
              </h2>
              
              <div className="space-y-3">
                {documents.slice(0, 5).map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getFileIcon(doc.type)}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {doc.status === 'processing' && (
                          (() => {
                            const stage = processingStages[doc.id] || 'processing';
                            const stageInfo = getProcessingStageInfo(stage);
                            const StageIcon = stageInfo.icon;
                            return (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <StageIcon className={`w-4 h-4 text-${stageInfo.color}-500`} />
                                </motion.div>
                                <span className={`text-sm text-${stageInfo.color}-600`}>
                                  {stageInfo.text}
                                </span>
                              </>
                            );
                          })()
                        )}
                        {doc.status === 'ready' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">{t('documents.ready')}</span>
                          </>
                        )}
                        {doc.status === 'error' && (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">{t('documents.error')}</span>
                          </>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeDocument(doc.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
           <h3 className="font-semibold text-blue-900 mb-2">{t('documents.tips')}</h3>
            <ul className="space-y-1 text-blue-700">
             <li>{t('documents.tip1')}</li>
             <li>{t('documents.tip2')}</li>
             <li>{t('documents.tip3')}</li>
             <li>{t('documents.tip4')}</li>
             <li>{t('documents.tip5')}</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          {/* Document Management */}
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('documents.searchDocuments')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('documents.allStatus')}</option>
                <option value="ready">{t('documents.ready')}</option>
                <option value="processing">{t('documents.processing')}</option>
                <option value="error">{t('documents.error')}</option>
              </select>
              <div className="text-sm text-gray-600 flex items-center">
                {filteredDocuments.length} of {documents.length} documents
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getFileIcon(doc.type)}</div>
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center gap-2">
                      {doc.status === 'ready' && (
                        <>
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-sm text-green-600">{t('documents.ready')}</span>
                        </>
                      )}
                      {doc.status === 'processing' && (
                        <>
                          <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                          <span className="text-sm text-blue-600">{t('documents.processing')}</span>
                        </>
                      )}
                      {doc.status === 'error' && (
                        <>
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <span className="text-sm text-red-600">{t('documents.error')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('users.uploaded')}</span>
                    <span className="text-sm text-gray-900">{formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('documents.noDocuments')}</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? t('documents.tryAdjusting')
                  : t('documents.uploadFirst')
                }
              </p>
              <button
                onClick={() => setViewMode('upload')}
                className="btn-primary"
              >
                {t('documents.uploadDocuments')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentsManager;