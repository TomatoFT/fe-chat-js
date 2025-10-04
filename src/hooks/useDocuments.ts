import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { handleAuthError } from '../lib/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://157.10.52.80:8000';

// Document query keys
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: any) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
};

// Get documents (returns array according to schema)
export const useDocuments = () => {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to fetch documents');
      }

      return response.json();
    },
  });
};

// Get single document
export const useDocument = (id: string) => {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to fetch document');
      }

      return response.json();
    },
    enabled: !!id,
  });
};

// Upload document
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
};

// Delete document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to delete document');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
};

// Upload staff document
export const useUploadStaffDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/upload-staff`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload staff document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
};

// Upload students document
export const useUploadStudentsDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/upload-students`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload students document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
};

// Upload examinations document
export const useUploadExaminationsDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/upload-examinations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload examinations document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
};

// Download document
export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to download document');
      }

      return response.blob();
    },
  });
};

// Download example staff document
export const useDownloadExampleStaffDocument = () => {
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/example/staff`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to download example staff document');
      }

      return response.blob();
    },
  });
};

// Download example students document
export const useDownloadExampleStudentsDocument = () => {
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/example/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to download example students document');
      }

      return response.blob();
    },
  });
};

// Download example examinations document
export const useDownloadExampleExaminationsDocument = () => {
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/example/examinations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to download example examinations document');
      }

      return response.blob();
    },
  });
};

// Search documents using RAG
export const useSearchDocuments = (query: string, documentIds?: number[], limit: number = 5) => {
  return useQuery({
    queryKey: documentKeys.list({ search: query }),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/indexing/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          document_ids: documentIds,
          limit,
        }),
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to search documents');
      }

      return response.json();
    },
    enabled: !!query && query.length > 2,
  });
};