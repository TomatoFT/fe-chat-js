import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Building2, Users, Eye, Edit, Trash2, Save, X } from 'lucide-react';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '../../hooks/useDepartments';

interface Department {
  id: string;
  name: string;
  admin_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const DepartmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState<Department | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '' });
  
  // Fetch departments from API
  const { data: departments, isLoading, error } = useDepartments();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const filteredDepartments = (departments || []).filter((department: any) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
  };

  const handleDelete = (departmentId: string) => {
    setShowDeleteModal(departmentId);
  };

  const confirmDelete = async () => {
    if (showDeleteModal) {
      try {
        await deleteDepartment.mutateAsync(showDeleteModal);
        setShowDeleteModal(null);
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const handleView = (department: Department) => {
    setShowViewModal(department);
  };

  const handleCreate = async () => {
    try {
      await createDepartment.mutateAsync({ 
        department_data: { name: newDepartment.name },
        user_data: { name: 'Admin User', email: 'admin@example.com', password: 'password123' }
      });
      setNewDepartment({ name: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const handleUpdate = async () => {
    if (editingDepartment) {
      try {
        await updateDepartment.mutateAsync({
          id: editingDepartment.id,
          data: { 
            department_data: { name: editingDepartment.name }
          }
        });
        setEditingDepartment(null);
      } catch (error) {
        console.error('Error updating department:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading departments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">Error loading departments: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
        <p className="text-gray-600">Manage educational departments in the system</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Create Department Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Department</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Department name"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleCreate}
              disabled={!newDepartment.name.trim() || createDepartment.isPending}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {createDepartment.isPending ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewDepartment({ name: '' });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Departments List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No departments found matching your search.' : 'No departments found.'}
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((department: any, index: number) => (
                  <motion.tr
                    key={department.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          {editingDepartment?.id === department.id ? (
                            <input
                              type="text"
                              value={editingDepartment?.name || ''}
                              onChange={(e) => editingDepartment && setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              autoFocus
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{department.name}</div>
                          )}
                          <div className="text-sm text-gray-500">ID: {department.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(department.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {editingDepartment?.id === department.id ? (
                          <>
                            <button
                              onClick={handleUpdate}
                              disabled={updateDepartment.isPending}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingDepartment(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleView(department)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(department)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(department.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Department Details</h3>
                <button
                  onClick={() => setShowViewModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{showViewModal.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ID</label>
                  <p className="text-sm text-gray-900">{showViewModal.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(showViewModal.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {new Date(showViewModal.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Department
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete this department? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleteDepartment.isPending}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteDepartment.isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <p className="text-lg font-bold text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
