import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RolesService } from '../api-client';
import { roleCreateSchema, roleUpdateSchema, type RoleCreateInput, type RoleUpdateInput } from '../lib/validations';

// Role query keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...roleKeys.lists(), { filters }] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

// Get all roles
export const useRoles = (params?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: roleKeys.list(params || {}),
    queryFn: async () => {
      return await RolesService.getRolesRolesGet(params);
    },
  });
};

// Get single role
export const useRole = (roleId: string) => {
  return useQuery({
    queryKey: roleKeys.detail(roleId),
    queryFn: async () => {
      return await RolesService.getRoleRolesRoleIdGet(roleId);
    },
    enabled: !!roleId,
  });
};

// Create role mutation
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RoleCreateInput) => {
      const validatedData = roleCreateSchema.parse(data);
      return await RolesService.createRoleRolesPost(validatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

// Update role mutation
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RoleUpdateInput }) => {
      const validatedData = roleUpdateSchema.parse(data);
      return await RolesService.updateRoleRolesRoleIdPut(id, validatedData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

// Delete role mutation
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      return await RolesService.deleteRoleRolesRoleIdDelete(roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};
