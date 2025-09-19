import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '../../lib/validations';
import { useRegister } from '../../hooks/useAuth';
import { useRoles } from '../../hooks/useRoles';

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const register = useRegister();
  const { data: roles } = useRoles();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      await register.mutateAsync(data);
      onSuccess?.();
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error?.status === 400) {
        setError('root', { message: 'Email already exists or invalid data' });
      } else if (error?.status === 422) {
        setError('root', { message: 'Please check your input and try again' });
      } else {
        setError('root', { message: 'An error occurred during registration. Please try again.' });
      }
      
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{errors.root.message}</div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          {...registerField('name')}
          type="text"
          id="name"
          autoComplete="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          {...registerField('email')}
          type="email"
          id="email"
          autoComplete="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...registerField('password')}
          type="password"
          id="password"
          autoComplete="new-password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          {...registerField('confirmPassword', {
            validate: (value) => value === password || 'Passwords do not match',
          })}
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          {...registerField('role_id', { valueAsNumber: true })}
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

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </div>
    </form>
  );
};
