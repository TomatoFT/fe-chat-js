export interface User {
  id: string;
  email?: string;
  name?: string;
  role: 'school_manager' | 'province_manager' | 'department_manager' | 'admin';
  role_id: string;
  provinceId?: string;
  schoolId?: string;
  departmentId?: string;
  adminId?: string;
  createdAt?: string;
}

export interface School {
  id: string;
  name: string;
  email: string;
  provinceId: string;
  documentsCount: number;
  lastActive: string;
  createdAt: string;
}

export interface Province {
  id: string;
  name: string;
  department_id?: string;
  user_id?: string;
  email?: string;
  schoolsCount: number;
  documentsCount: number;
  lastActive: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  schoolId: string;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'error';
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  documentReferences?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}