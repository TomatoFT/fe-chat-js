import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { handleAuthError } from '../lib/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000';

// Chat query keys
export const chatKeys = {
  all: ['chat'] as const,
  sessions: () => [...chatKeys.all, 'sessions'] as const,
  session: (id: string) => [...chatKeys.sessions(), id] as const,
  messages: (sessionId: string) => [...chatKeys.all, 'messages', sessionId] as const,
  documents: () => [...chatKeys.all, 'documents'] as const,
};

// Get chat sessions
export const useChatSessions = () => {
  return useQuery({
    queryKey: chatKeys.sessions(),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to fetch chat sessions');
      }

      return response.json();
    },
  });
};

// Get single chat session
export const useChatSession = (id: string) => {
  return useQuery({
    queryKey: chatKeys.session(id),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/sessions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to fetch chat session');
      }

      return response.json();
    },
    enabled: !!id,
  });
};

// Get messages for a session
export const useChatMessages = (sessionId: string) => {
  return useQuery({
    queryKey: chatKeys.messages(sessionId),
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to fetch messages');
      }

      return response.json();
    },
    enabled: !!sessionId,
  });
};

// Create new chat session
export const useCreateChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title?: string; school_id?: string }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create chat session');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
    },
  });
};

// Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      message: string; 
      session_id?: string;
      document_ids?: string[];
    }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: data.message,
          session_id: data.session_id,
          document_ids: data.document_ids,
        }),
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      if (variables.session_id) {
        queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.session_id) });
      }
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
    },
  });
};

// Rename chat session
export const useRenameChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; name: string }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/sessions/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: data.name }),
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to rename chat session');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: chatKeys.session(variables.id) });
    },
  });
};

// Delete chat session
export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/sessions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (handleAuthError(response, true)) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to delete chat session');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
    },
  });
};

// Get documents for RAG
export const useDocumentsForRAG = () => {
  return useQuery({
    queryKey: chatKeys.documents(),
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