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
  usersCount: number;
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
  usersCount: number;
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

export interface Student {
  id: string;
  full_name: string;
  birth_date: string;
  gender: string;
  class_name: string;
  academic_year: string;
  ethnic: string;
  is_poor: boolean;
  notes?: string;
  school_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  id: string;
  full_name?: string;
  birth_date: string;
  gender?: string;
  subject?: string;
  position?: string;
  ethnic?: string;
  notes?: string;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Examination {
  id: string;
  exam_name?: string;
  date: string;
  student_name?: string;
  student_class?: string;
  subject?: string;
  point?: number;
  notes?: string;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
}