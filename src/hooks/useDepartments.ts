import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DepartmentsService } from '../api-client/services/DepartmentsService';
import { Body_create_department_departments__post } from '../api-client/models/Body_create_department_departments__post';
import { Body_update_department_departments__department_id__put } from '../api-client/models/Body_update_department_departments__department_id__put';

// Get all departments
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => DepartmentsService.getDepartmentsDepartmentsGet(),
  });
};

// Get single department
export const useDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: ['departments', departmentId],
    queryFn: () => DepartmentsService.getDepartmentDepartmentsDepartmentIdGet(departmentId),
    enabled: !!departmentId,
  });
};

// Create department
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Body_create_department_departments__post) =>
      DepartmentsService.createDepartmentDepartmentsPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

// Update department
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Body_update_department_departments__department_id__put }) =>
      DepartmentsService.updateDepartmentDepartmentsDepartmentIdPut(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments', variables.id] });
    },
  });
};

// Delete department
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (departmentId: string) =>
      DepartmentsService.deleteDepartmentDepartmentsDepartmentIdDelete(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};
