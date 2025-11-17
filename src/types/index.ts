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
  fullname?: string | null;
  birthday?: string | null;
  class_name?: string | null;
  starting_date?: string | null;
  gender?: string | null;
  nation?: string | null;
  current_address?: Record<string, any> | null;
  household_registration_address?: Record<string, any> | null;
  place_of_birth?: Record<string, any> | null;
  hometown?: Record<string, any> | null;
  birth_registration_place?: Record<string, any> | null;
  ethnicity?: string | null;
  religion?: string | null;
  policy_beneficiary?: string | null;
  near_poor?: string | null;
  union_member?: string | null;
  team_member?: string | null;
  disability?: string | null;
  residence_status?: string | null;
  notes?: string | null;
  school_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Staff {
  id: string;
  fullname: string;
  gender?: string | null;
  birthday?: string | null;
  ethnicity?: string | null;
  religion?: string | null;
  nationality?: string | null;
  province_city?: string | null;
  ward?: string | null;
  hamlet?: string | null;
  hometown_province?: string | null;
  hometown_ward?: string | null;
  hometown_hamlet?: string | null;
  is_union_member?: string | null;
  is_party_member?: string | null;
  teaching_subject?: string | null;
  school_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Examination {
  id: string;
  full_name?: string | null;
  birthday?: string | null;
  gender?: string | null;
  class_name?: string | null;
  semester?: string | null;
  academic_year?: string | null;
  subject?: string | null;
  point_score?: number | null;
  category_score?: string | null;
  notes?: string | null;
  school_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}