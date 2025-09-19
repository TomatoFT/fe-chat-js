import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema, type UserCreateInput } from '../../lib/validations';
import { useCreateUser, useUpdateUser } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';

interface UserFormProps {
  initialData?: Partial<UserCreateInput>;
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  userId,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { data: roles } = useRoles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: UserCreateInput) => {
    setIsSubmitting(true);
    try {
      if (userId) {
        await updateUser.mutateAsync({ id: userId, data });
      } else {
        await createUser.mutateAsync(data);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter user name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          {...register('role_id', { valueAsNumber: true })}
          id="role_id"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a role</option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.role_id && (
          <p className="mt-1 text-sm text-red-600">{errors.role_id.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : userId ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};
