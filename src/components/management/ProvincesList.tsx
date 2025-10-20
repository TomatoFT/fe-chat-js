import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Building2, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { Province } from '../../types';
import { useProvinces, useUpdateProvince, useDeleteProvince } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../utils/userUtils';

const ProvincesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState<Province | null>(null);
  
  // Auth context
  const { user } = useAuth();
  
  // Fetch provinces from API
  const { data: provinces, isLoading, error } = useProvinces();
  const updateProvince = useUpdateProvince();
  const deleteProvince = useDeleteProvince();

  const filteredProvinces = (provinces || []).filter((province: any) =>
    province.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (province: Province) => {
    setEditingProvince(province);
  };

  const handleDelete = (provinceId: string) => {
    setShowDeleteModal(provinceId);
  };

  const confirmDelete = async () => {
    if (showDeleteModal) {
      try {
        await deleteProvince.mutateAsync(showDeleteModal);
        setShowDeleteModal(null);
      } catch (error) {
        console.error('Error deleting province:', error);
      }
    }
  };

  const handleView = (province: Province) => {
    setShowViewModal(province);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Đang tải danh sách tỉnh...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">Lỗi tải danh sách tỉnh: {error.message}</div>
        </div>
      </div>
    );
  }

  const ViewModal = ({ province }: { province: Province }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết tỉnh</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Tên tỉnh</label>
            <p className="text-gray-900">{province.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{province.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Số trường học</label>
            <p className="text-gray-900">{province.schoolsCount || 0}</p>
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

  const EditModal = ({ province }: { province: Province }) => {
    const [formData, setFormData] = useState({
      email: province.email || '',
      password: '',
      department_id: province.department_id || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await updateProvince.mutateAsync({
          id: province.id,
          data: formData,
        });
        setEditingProvince(null);
      } catch (error) {
        console.error('Error updating province:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa tỉnh</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Department ID - only editable by admin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã bộ phận
                {!hasPermission(user, 'manage_users') && (
                  <span className="text-xs text-gray-500 ml-1">(Chỉ đọc)</span>
                )}
              </label>
              <input
                type="text"
                value={formData.department_id}
                onChange={(e) => setFormData(prev => ({ ...prev, department_id: e.target.value }))}
                className={`input-field ${!hasPermission(user, 'manage_users') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Nhập mã bộ phận"
                disabled={!hasPermission(user, 'manage_users')}
              />
            </div>
            
            {/* Email field - Read only since API doesn't support updating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
                <span className="text-xs text-gray-500 ml-1">(Chỉ đọc)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                className="input-field bg-gray-100 cursor-not-allowed"
                placeholder="Email không thể cập nhật"
                disabled
              />
            </div>
            
            {/* Password field */}
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
                onClick={() => setEditingProvince(null)}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xóa tỉnh</h3>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa tỉnh này? Điều này cũng sẽ xóa tất cả các trường học liên quan. Hành động này không thể hoàn tác.
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tỉnh</h1>
          <p className="text-gray-600">Quản lý tất cả các tỉnh và cơ sở giáo dục</p>
        </div>
        <Link
          to="/add-province"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm tỉnh mới
        </Link>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tỉnh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredProvinces.length} trong tổng số {provinces?.length || 0} tỉnh
          </div>
        </div>
      </div>

      {/* Provinces Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỉnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số trường học
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
              {filteredProvinces.map((province: any, index: number) => (
                <motion.tr
                  key={province.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{province.name}</div>
                        <div className="text-sm text-gray-500">Tỉnh</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{province.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{province.schoolsCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{province.usersCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(province)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        title="Xem"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(province)}
                        className="text-gray-400 hover:text-green-600 transition-colors p-1"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(province.id)}
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

      {filteredProvinces.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tỉnh</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Thử điều chỉnh từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm tỉnh đầu tiên'}
          </p>
          <Link to="/add-province" className="btn-primary">
            Thêm tỉnh mới
          </Link>
        </div>
      )}

      {/* Modals */}
      {showViewModal && <ViewModal province={showViewModal} />}
      {editingProvince && <EditModal province={editingProvince} />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default ProvincesList;