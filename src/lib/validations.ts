import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role_id: z.number().int().positive('Role ID must be a positive integer').optional(),
});

// User schemas
export const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  role_id: z.number().int().positive('Role ID must be a positive integer').optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  role_id: z.number().int().positive('Role ID must be a positive integer').optional(),
});

// Role schemas
export const roleCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

export const roleUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
});

// Department schemas
export const departmentCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const departmentUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
});

// Province schemas
export const provinceCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  department_id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const provinceUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  department_id: z.string().optional(),
  user_id: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

// School schemas
export const schoolCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  province_id: z.string().optional(),
});

export const schoolUpdateSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  province_id: z.string().optional(),
});

// Chat schemas
export const chatSendSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  session_id: z.string().uuid('Invalid session ID').optional(),
});

export const chatSessionCreateSchema = z.object({
  name: z.string().min(1, 'Session name cannot be empty'),
});

export const chatSessionRenameSchema = z.object({
  name: z.string().min(1, 'Session name cannot be empty'),
});

// Document schemas
export const documentUploadSchema = z.object({
  file: z.instanceof(File, 'File is required'),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
});

// Search schemas
export const searchDocumentsSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
  limit: z.number().int().positive('Limit must be a positive integer').max(100).optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type RoleCreateInput = z.infer<typeof roleCreateSchema>;
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;
export type DepartmentCreateInput = z.infer<typeof departmentCreateSchema>;
export type DepartmentUpdateInput = z.infer<typeof departmentUpdateSchema>;
export type ProvinceCreateInput = z.infer<typeof provinceCreateSchema>;
export type ProvinceUpdateInput = z.infer<typeof provinceUpdateSchema>;
export type SchoolCreateInput = z.infer<typeof schoolCreateSchema>;
export type SchoolUpdateInput = z.infer<typeof schoolUpdateSchema>;
export type ChatSendInput = z.infer<typeof chatSendSchema>;
export type ChatSessionCreateInput = z.infer<typeof chatSessionCreateSchema>;
export type ChatSessionRenameInput = z.infer<typeof chatSessionRenameSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type SearchDocumentsInput = z.infer<typeof searchDocumentsSchema>;
