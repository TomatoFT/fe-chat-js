import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthenticationService, UsersService } from '../api-client';
import { setAuthToken, clearAuthToken, getAuthToken } from '../lib/api-client';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../lib/validations';

// Auth query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const validatedData = loginSchema.parse(data);
      const response = await AuthenticationService.loginAuthLoginPost(validatedData);
      return response;
    },
    onSuccess: (data) => {
      setAuthToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
    onError: () => {
      clearAuthToken();
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const validatedData = registerSchema.parse(data);
      const response = await AuthenticationService.registerAuthRegisterPost(validatedData);
      return response;
    },
    onSuccess: () => {
      // Register returns UserResponse, so we need to login after registration
      // or handle the response differently based on your API design
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
    onError: () => {
      clearAuthToken();
    },
  });
};

// Get current user
export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      if (!getAuthToken()) {
        throw new Error('No authentication token');
      }
      return await UsersService.getCurrentUserInfoUsersMeGet();
    },
    enabled: !!getAuthToken(),
    retry: false,
  });
};

// Logout function
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    clearAuthToken();
    queryClient.clear();
  };
};
