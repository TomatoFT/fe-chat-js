import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Student, Staff, Examination } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://157.10.52.80:8000';

// Query keys
export const schoolManagementKeys = {
  students: {
    all: ['students'] as const,
    lists: () => [...schoolManagementKeys.students.all, 'list'] as const,
    list: (filters: any) => [...schoolManagementKeys.students.lists(), filters] as const,
    details: () => [...schoolManagementKeys.students.all, 'detail'] as const,
    detail: (id: string) => [...schoolManagementKeys.students.details(), id] as const,
  },
  staff: {
    all: ['staff'] as const,
    lists: () => [...schoolManagementKeys.staff.all, 'list'] as const,
    list: (filters: any) => [...schoolManagementKeys.staff.lists(), filters] as const,
    details: () => [...schoolManagementKeys.staff.all, 'detail'] as const,
    detail: (id: string) => [...schoolManagementKeys.staff.details(), id] as const,
  },
  examinations: {
    all: ['examinations'] as const,
    lists: () => [...schoolManagementKeys.examinations.all, 'list'] as const,
    list: (filters: any) => [...schoolManagementKeys.examinations.lists(), filters] as const,
    details: () => [...schoolManagementKeys.examinations.all, 'detail'] as const,
    detail: (id: string) => [...schoolManagementKeys.examinations.details(), id] as const,
  },
};

// ===== STUDENTS HOOKS =====

// Get students with pagination
export const useStudents = (filters: {
  skip?: number;
  limit?: number;
} = {}) => {
  return useQuery({
    queryKey: schoolManagementKeys.students.list(filters),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/students/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      return response.json();
    },
  });
};

// Get single student
export const useStudent = (id: string) => {
  return useQuery({
    queryKey: schoolManagementKeys.students.detail(id),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/students/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student');
      }

      return response.json();
    },
    enabled: !!id,
  });
};

// Create student
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      student_id: string;
      class_name: string;
      date_of_birth: string;
      gender: 'male' | 'female';
      address: string;
      phone_number?: string;
      email?: string;
      parent_name?: string;
      parent_phone?: string;
      enrollment_date: string;
      school_id: string;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create student');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.students.all });
    },
  });
};

// Update student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<Student>;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update student');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.students.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.students.all });
    },
  });
};

// Delete student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.students.all });
    },
  });
};

// ===== STAFF HOOKS =====

// Get staff with pagination
export const useStaff = (filters: {
  skip?: number;
  limit?: number;
} = {}) => {
  return useQuery({
    queryKey: schoolManagementKeys.staff.list(filters),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/staff/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      return response.json();
    },
  });
};

// Get single staff member
export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: schoolManagementKeys.staff.detail(id),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/staff/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff member');
      }

      return response.json();
    },
    enabled: !!id,
  });
};

// Create staff member
export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      staff_id: string;
      position: string;
      department: string;
      date_of_birth: string;
      gender: 'male' | 'female';
      address: string;
      phone_number?: string;
      email?: string;
      hire_date: string;
      salary?: number;
      school_id: string;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/staff/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create staff member');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.staff.all });
    },
  });
};

// Update staff member
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<Staff>;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update staff member');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.staff.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.staff.all });
    },
  });
};

// Delete staff member
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff member');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.staff.all });
    },
  });
};

// ===== EXAMINATIONS HOOKS =====

// Get examinations with pagination
export const useExaminations = (filters: {
  skip?: number;
  limit?: number;
} = {}) => {
  return useQuery({
    queryKey: schoolManagementKeys.examinations.list(filters),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/examinations/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch examinations');
      }

      return response.json();
    },
  });
};

// Get single examination
export const useExamination = (id: string) => {
  return useQuery({
    queryKey: schoolManagementKeys.examinations.detail(id),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/examinations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch examination');
      }

      return response.json();
    },
    enabled: !!id,
  });
};

// Create examination
export const useCreateExamination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      exam_type: 'midterm' | 'final' | 'quiz' | 'assignment';
      subject: string;
      class_name: string;
      exam_date: string;
      duration_minutes: number;
      total_marks: number;
      passing_marks: number;
      description?: string;
      school_id: string;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/examinations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create examination');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.examinations.all });
    },
  });
};

// Update examination
export const useUpdateExamination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<Examination>;
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/examinations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update examination');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.examinations.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.examinations.all });
    },
  });
};

// Delete examination
export const useDeleteExamination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/school-audit/examinations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete examination');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolManagementKeys.examinations.all });
    },
  });
};
