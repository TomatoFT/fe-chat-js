import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building2, AlertCircle, CheckCircle } from 'lucide-react';
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
      setError(err.message || 'Failed to create province. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Province</h1>
        <p className="text-gray-600">Create a new province management account</p>
      </div>

      <div className="max-w-2xl">
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">Province account created successfully!</span>
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
                  Province Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="input-field"
                  placeholder="Enter province name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="Enter province manager email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className="input-field"
                placeholder="Enter password for province manager account"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                * Required fields
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
                {createProvince.isPending ? 'Creating Province...' : 'Create Province'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Important Notes:</h3>
          <ul className="space-y-1 text-blue-700 text-sm">
            <li>• The province manager will receive login credentials via email</li>
            <li>• Province managers can add and manage schools in their region</li>
            <li>• They can monitor all school activities and document uploads</li>
            <li>• Province accounts can change their password after first login</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProvince;