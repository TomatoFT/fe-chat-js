import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000';

// Hook to fetch additional user details based on role and role_id
export const useUserDetails = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userDetails', user?.id, user?.role, user?.role_id],
    queryFn: async () => {
      if (!user || !user.role_id) {
        return null;
      }

      const token = localStorage.getItem('token');
      let endpoint = '';

      // Determine the correct endpoint based on user role
      switch (user.role) {
        case 'school_manager':
          endpoint = `/schools/${user.role_id}`;
          break;
        case 'province_manager':
          endpoint = `/provinces/${user.role_id}`;
          break;
        case 'department_manager':
          endpoint = `/departments/${user.role_id}`;
          break;
        case 'admin':
          endpoint = `/admins/${user.role_id}`;
          break;
        default:
          return null;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      
      // Return the data with the appropriate structure
      return {
        ...data,
        role: user.role,
        role_id: user.role_id,
        user_id: user.id,
      };
    },
    enabled: !!user && !!user.role_id,
  });
};

// Hook to get user's display name
export const useUserDisplayName = () => {
  const { data: userDetails, isLoading } = useUserDetails();
  const { user } = useAuth();

  if (isLoading) {
    return { name: 'Loading...', isLoading: true };
  }

  if (!userDetails) {
    return { name: user?.name || 'User', isLoading: false };
  }

  // Extract name based on role
  let displayName = 'User';
  switch (user?.role) {
    case 'school_manager':
      displayName = userDetails.name || 'School Manager';
      break;
    case 'province_manager':
      displayName = userDetails.name || 'Province Manager';
      break;
    case 'department_manager':
      displayName = userDetails.name || 'Department Manager';
      break;
    case 'admin':
      displayName = userDetails.name || 'Administrator';
      break;
  }

  return { name: displayName, isLoading: false };
};

// Hook to get user's email
export const useUserEmail = () => {
  const { data: userDetails, isLoading } = useUserDetails();
  const { user } = useAuth();

  if (isLoading) {
    return { email: 'Loading...', isLoading: true };
  }

  if (!userDetails) {
    return { email: user?.email || '', isLoading: false };
  }

  // Extract email based on role
  let email = '';
  switch (user?.role) {
    case 'school_manager':
      email = userDetails.email || '';
      break;
    case 'province_manager':
      email = userDetails.email || '';
      break;
    case 'department_manager':
      email = userDetails.email || '';
      break;
    case 'admin':
      email = userDetails.email || '';
      break;
  }

  return { email, isLoading: false };
};
