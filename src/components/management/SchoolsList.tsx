import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, School, FileText, Eye, Edit, Trash2 } from 'lucide-react';
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
          <div className="text-lg text-gray-600">Đang tải danh sách trường học...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">Lỗi tải danh sách trường học: {error.message}</div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết trường học</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Tên trường</label>
            <p className="text-gray-900">{school.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{school.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Số tài liệu</label>
            <p className="text-gray-900">{school.documentsCount || 0}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-4 mt-4 border-t">
          <button
            onClick={() => setShowViewModal(null)}
            className="flex-1 btn-secondary"
          >
            Đóng
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa trường học</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Province ID - only editable by admin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã tỉnh
                {!hasPermission(user, 'manage_users') && (
                  <span className="text-xs text-gray-500 ml-1">(Chỉ đọc)</span>
                )}
              </label>
              <input
                type="text"
                value={formData.province_id}
                onChange={(e) => setFormData(prev => ({ ...prev, province_id: e.target.value }))}
                className={`input-field ${!hasPermission(user, 'manage_users') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Nhập mã tỉnh"
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
                placeholder="Nhập email mới"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input-field"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditingSchool(null)}
                className="flex-1 btn-secondary"
              >
                Hủy
              </button>
              <button type="submit" className="flex-1 btn-primary">
                Lưu thay đổi
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xóa trường học</h3>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa trường học này? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(null)}
            className="flex-1 btn-secondary"
          >
            Hủy
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Xóa
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý trường học</h1>
          <p className="text-gray-600">Quản lý các trường học trong tỉnh của bạn</p>
        </div>
        <Link
          to="/add-school"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm trường học mới
        </Link>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trường học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredSchools.length} trong tổng số {schools?.length || 0} trường học
          </div>
        </div>
      </div>

      {/* Schools Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trường học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tài liệu
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchools.map((school: any, index: number) => (
                <motion.tr
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <School className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{school.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{school.documentsCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(school)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        title="Xem"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(school)}
                        className="text-gray-400 hover:text-green-600 transition-colors p-1"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(school.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy trường học</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Thử điều chỉnh từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm trường học đầu tiên'}
          </p>
          <Link to="/add-school" className="btn-primary">
            Thêm trường học mới
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