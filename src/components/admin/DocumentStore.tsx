import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Trash2, Search, Filter, FolderOpen, File, Calendar, User } from 'lucide-react';
import { Document } from '../../types';
import { useDocuments } from '../../hooks/useDocuments';
import { useUsers } from '../../hooks/useUsers';
import { useProvinces, useSchools } from '../../hooks/useUsers';

const DocumentStore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Fetch real data from APIs
  const { data: documents, isLoading: documentsLoading, error: documentsError } = useDocuments();
  const { data: users } = useUsers({ skip: 0, limit: 1000 });
  const { data: provinces } = useProvinces();
  const { data: schools } = useSchools();

  // Enhance documents with owner information
  const enhancedDocuments = React.useMemo(() => {
    if (!documents || !users || !provinces || !schools) return [];

    return documents.map((doc: any) => {
      const owner = users.find((user: any) => user.id === doc.uploadedBy);
      const province = provinces.find((prov: any) => prov.id === doc.provinceId);
      const school = schools.find((sch: any) => sch.id === doc.schoolId);
      
      return {
        ...doc,
        ownerName: owner?.name || 'Unknown User',
        ownerRole: owner?.role?.name || owner?.role || 'unknown',
        provinceName: province?.name || school?.provinceId,
      };
    });
  }, [documents, users, provinces, schools]);

  const filteredDocuments = enhancedDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || doc.ownerRole === selectedRole;
    const matchesType = selectedType === 'all' || doc.type.includes(selectedType);
    return matchesSearch && matchesRole && matchesType;
  });

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'deputy': return 'purple';
      case 'province': return 'blue';
      case 'school': return 'green';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (documentsLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading documents...</div>
        </div>
      </div>
    );
  }

  if (documentsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">Error loading documents: {documentsError.message}</div>
        </div>
      </div>
    );
  }

  const DocumentCard = ({ doc, index }: { doc: any; index: number }) => (
    <motion.div
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
          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Owner</span>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getRoleColor(doc.ownerRole)}-100 text-${getRoleColor(doc.ownerRole)}-800 capitalize`}>
              {doc.ownerRole}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Uploaded</span>
          <span className="text-sm text-gray-900">{formatDate(doc.uploadedAt)}</span>
        </div>
        <div className="text-sm text-gray-900 font-medium">{doc.ownerName}</div>
        {doc.provinceName && (
          <div className="text-sm text-gray-600">{doc.provinceName}</div>
        )}
      </div>
    </motion.div>
  );

  const DocumentRow = ({ doc, index }: { doc: any; index: number }) => (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-2xl mr-3">{getFileIcon(doc.type)}</div>
          <div>
            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
            <div className="text-sm text-gray-500">{formatFileSize(doc.size)}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{doc.ownerName}</div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getRoleColor(doc.ownerRole)}-100 text-${getRoleColor(doc.ownerRole)}-800 capitalize`}>
            {doc.ownerRole}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {doc.provinceName || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(doc.uploadedAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button className="text-blue-600 hover:text-blue-900">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-900">
            <Download className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Store</h1>
        <p className="text-gray-600">Centralized document management for all system users</p>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents by name or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="deputy">Deputy</option>
            <option value="province">Province</option>
            <option value="school">School</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="word">Word</option>
            <option value="sheet">Excel</option>
          </select>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <File className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredDocuments.length} of {enhancedDocuments.length} documents
          </div>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <DocumentCard key={doc.id} doc={doc} index={index} />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Province
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc, index) => (
                  <DocumentRow key={doc.id} doc={doc} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms or filters' : 'No documents have been uploaded yet'}
          </p>
        </div>
      )}

      {/* Storage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Deputy Docs</p>
              <p className="text-xl font-bold text-gray-900">
                {enhancedDocuments.filter(d => d.ownerRole === 'department_manager').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Province Docs</p>
              <p className="text-xl font-bold text-gray-900">
                {enhancedDocuments.filter(d => d.ownerRole === 'province_manager').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">School Docs</p>
              <p className="text-xl font-bold text-gray-900">
                {enhancedDocuments.filter(d => d.ownerRole === 'school_manager').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-xl font-bold text-gray-900">
                {formatFileSize(enhancedDocuments.reduce((sum, doc) => sum + doc.size, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentStore;