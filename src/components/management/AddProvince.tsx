import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { provinceCreateSchema, type ProvinceCreateInput } from '../../lib/validations';
import { useCreateProvince } from '../../hooks/useUsers';

const AddProvince: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const createProvince = useCreateProvince();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProvinceCreateInput>({
    resolver: zodResolver(provinceCreateSchema),
  });

  const onSubmit = async (data: ProvinceCreateInput) => {
    setError('');
    setSuccess(false);

    try {
      await createProvince.mutateAsync(data);
      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message || 'Không thể tạo tỉnh. Vui lòng thử lại.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm tỉnh mới</h1>
        <p className="text-gray-600">Tạo tài khoản quản lý tỉnh mới</p>
      </div>

      <div className="max-w-2xl">
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">Tài khoản tỉnh đã được tạo thành công!</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tỉnh *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="input-field"
                  placeholder="Nhập tên tỉnh"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="Nhập email quản lý tỉnh"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu *
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className="input-field"
                placeholder="Nhập mật khẩu cho quản lý tỉnh"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                * Các trường bắt buộc
              </p>
              <button
                type="submit"
                disabled={createProvince.isPending}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createProvince.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {createProvince.isPending ? 'Đang tạo tỉnh...' : 'Tạo tỉnh'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng:</h3>
          <ul className="space-y-1 text-blue-700 text-sm">
            <li>• Quản lý tỉnh sẽ nhận thông tin đăng nhập qua email</li>
            <li>• Quản lý tỉnh có thể thêm và quản lý các trường học trong khu vực</li>
            <li>• Họ có thể theo dõi tất cả hoạt động của trường học và tải lên tài liệu</li>
            <li>• Tài khoản tỉnh có thể thay đổi mật khẩu sau lần đăng nhập đầu tiên</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProvince;