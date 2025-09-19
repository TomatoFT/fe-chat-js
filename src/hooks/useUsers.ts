import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://157.10.52.80:8000';

// User query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: any) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

// Get users with pagination (admin only)
export const useUsers = (filters: {
  skip?: number;
  limit?: number;
} = {}) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/users/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return response.json();
    },
  });
};

// Get single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return response.json();
    },
    enabled: !!id,
  });
};

// Get current user
export const useMe = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }

      return response.json();
    },
    enabled: !!localStorage.getItem('token'),
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      role_id: number;
      school_id?: string;
      province_id?: string;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<{
        name: string;
        email: string;
        role_id: number;
        school_id: string;
        province_id: string;
        is_active: boolean;
      }>;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update user');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Get roles
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/roles/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      return response.json();
    },
  });
};

// Get schools
export const useSchools = (provinceId?: string) => {
  return useQuery({
    queryKey: ['schools', provinceId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = provinceId ? `?province_id=${provinceId}` : '';
      const response = await fetch(`${API_BASE_URL}/schools/${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }

      return response.json();
    },
  });
};

// Create school
export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      province_id?: string;
    }) => {
      const token = localStorage.getItem('token');
      
      // Set the authorization header and base URL for the API client
      const { OpenAPI } = await import('../api-client');
      OpenAPI.BASE = API_BASE_URL;
      if (token) {
        OpenAPI.TOKEN = token;
      }
      
      console.log('Creating school with data:', data);
      console.log('API Base URL:', API_BASE_URL);
      
      const { SchoolsService } = await import('../api-client');
      
      const result = await SchoolsService.createSchoolSchoolsPost({
        name: data.name,
        email: data.email,
        password: data.password,
        province_id: data.province_id,
      });
      console.log('School creation result:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

// Update school
export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<{
        email: string;
        password: string;
      }>;
    }) => {
      const token = localStorage.getItem('token');
      
      // Set the authorization header and base URL for the API client
      const { OpenAPI } = await import('../api-client');
      OpenAPI.BASE = API_BASE_URL;
      if (token) {
        OpenAPI.TOKEN = token;
      }
      
      console.log('Updating school with ID:', id);
      console.log('Update data:', data);
      console.log('API Base URL:', API_BASE_URL);
      
      const { SchoolsService } = await import('../api-client');
      
      const result = await SchoolsService.updateSchoolSchoolsSchoolIdPut(id, data);
      console.log('Update result:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

// Delete school
export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/schools/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete school');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

// Get provinces
export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      
      // Set the authorization header and base URL for the API client
      const { OpenAPI } = await import('../api-client');
      OpenAPI.BASE = API_BASE_URL;
      if (token) {
        OpenAPI.TOKEN = token;
      }
      
      const { ProvincesService } = await import('../api-client');
      
      return ProvincesService.getProvincesProvincesGet();
    },
  });
};

// Create province
export const useCreateProvince = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      department_id?: string;
      email: string;
      password: string;
    }) => {
      const token = localStorage.getItem('token');
      
      // Set the authorization header and base URL for the API client
      const { OpenAPI } = await import('../api-client');
      OpenAPI.BASE = API_BASE_URL;
      if (token) {
        OpenAPI.TOKEN = token;
      }
      
      console.log('Creating province with data:', data);
      console.log('API Base URL:', API_BASE_URL);
      
      const { ProvincesService } = await import('../api-client');
      
      const result = await ProvincesService.createProvinceProvincesPost({
        province_data: {
          name: data.name,
          department_id: data.department_id,
        },
        user_data: {
          name: data.name,
          email: data.email,
          password: data.password,
          role_id: 2, // Assuming role_id 2 is for province managers
        },
      });
      console.log('Province creation result:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces'] });
    },
  });
};

// Update province
export const useUpdateProvince = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<{
        name: string;
        department_id: string;
        user_id: string;
      }>;
    }) => {
      const token = localStorage.getItem('token');
      
      // Set the authorization header and base URL for the API client
      const { OpenAPI } = await import('../api-client');
      OpenAPI.BASE = API_BASE_URL;
      if (token) {
        OpenAPI.TOKEN = token;
      }
      
      console.log('Updating province with ID:', id);
      console.log('Update data:', data);
      console.log('API Base URL:', API_BASE_URL);
      
      const { ProvincesService } = await import('../api-client');
      
      const result = await ProvincesService.updateProvinceProvincesProvinceIdPut(id, {
        province_data: {
          name: data.name,
          department_id: data.department_id,
          user_id: data.user_id,
        },
        user_update: data.password ? {
          id: data.user_id, // Use the user_id from the form data
          password: data.password,
        } : undefined,
      });
      console.log('Province update result:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['provinces'] });
    },
  });
};

// Delete province
export const useDeleteProvince = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/provinces/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete province');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces'] });
    },
  });
};