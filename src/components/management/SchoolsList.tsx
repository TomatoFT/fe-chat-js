import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, School, FileText, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { School as SchoolType } from '../../types';
import { useSchools, useUpdateSchool, useDeleteSchool } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../utils/userUtils';

const SchoolsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState<SchoolType | null>(null);
  
  // Auth context
  const { user } = useAuth();
  
  // Fetch schools from API
  const { data: schools, isLoading, error } = useSchools();
  const updateSchool = useUpdateSchool();
  const deleteSchool = useDeleteSchool();

  const filteredSchools = (schools || []).filter((school: any) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getActivityStatus = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInHours = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) return { status: 'active', color: 'green' };
    if (diffInHours < 72) return { status: 'recent', color: 'yellow' };
    return { status: 'inactive', color: 'red' };
  };

  const handleEdit = (school: SchoolType) => {
    setEditingSchool(school);
  };

  const handleDelete = (schoolId: string) => {
    setShowDeleteModal(schoolId);
  };

  const confirmDelete = async () => {
    if (showDeleteModal) {
      try {
        await deleteSchool.mutateAsync(showDeleteModal);
        setShowDeleteModal(null);
      } catch (error) {
        console.error('Error deleting school:', error);
      }
    }
  };

  const handleView = (school: SchoolType) => {
    setShowViewModal(school);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading schools...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">Error loading schools: {error.message}</div>
        </div>
      </div>
    );
  }

  const ViewModal = ({ school }: { school: SchoolType }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Details</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-gray-900">{school.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{school.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Documents</label>
            <p className="text-gray-900">{school.documentsCount}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Last Active</label>
            <p className="text-gray-900">{formatDate(school.lastActive)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Created</label>
            <p className="text-gray-900">{formatDate(school.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-4 mt-4 border-t">
          <button
            onClick={() => setShowViewModal(null)}
            className="flex-1 btn-secondary"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );

  const EditModal = ({ school }: { school: SchoolType }) => {
    const [formData, setFormData] = useState({
      email: school.email || '',
      password: '',
      province_id: school.provinceId || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await updateSchool.mutateAsync({
          id: school.id,
          data: formData,
        });
        setEditingSchool(null);
      } catch (error) {
        console.error('Error updating school:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit School</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Province ID - only editable by admin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province ID
                {!hasPermission(user, 'manage_users') && (
                  <span className="text-xs text-gray-500 ml-1">(Read-only)</span>
                )}
              </label>
              <input
                type="text"
                value={formData.province_id}
                onChange={(e) => setFormData(prev => ({ ...prev, province_id: e.target.value }))}
                className={`input-field ${!hasPermission(user, 'manage_users') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter province ID"
                disabled={!hasPermission(user, 'manage_users')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input-field"
                placeholder="Enter new email (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input-field"
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditingSchool(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete School</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this school? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(null)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schools Management</h1>
          <p className="text-gray-600">Manage schools in your province</p>
        </div>
        <Link
          to="/add-school"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New School
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredSchools.length} of {schools?.length || 0} schools
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchools.map((school: any, index: number) => {
          const activityStatus = getActivityStatus(school.lastActive);
          
          return (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <School className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{school.name}</h3>
                    <p className="text-sm text-gray-600">{school.email}</p>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Documents</span>
                  </div>
                  <span className="font-medium text-gray-900">{school.documentsCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${activityStatus.color}-500`}></div>
                    <span className="text-sm text-gray-600">Last Active</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {formatDate(school.lastActive)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Joined</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(school.createdAt)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button 
                  onClick={() => handleView(school)}
                  className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button 
                  onClick={() => handleEdit(school)}
                  className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(school.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first school'}
          </p>
          <Link to="/add-school" className="btn-primary">
            Add New School
          </Link>
        </div>
      )}

      {/* Modals */}
      {showViewModal && <ViewModal school={showViewModal} />}
      {editingSchool && <EditModal school={editingSchool} />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default SchoolsList;