import { User } from '../types';

/**
 * Utility functions for working with user data based on the UserResponse API specification
 */

/**
 * Get the entity ID for the user's role
 * @param user - User object with role and role_id
 * @returns The appropriate entity ID based on the user's role
 */
export const getUserEntityId = (user: User | null): string | undefined => {
  if (!user || !user.role_id) {
    return undefined;
  }

  switch (user.role) {
    case 'school_manager':
      return user.schoolId;
    case 'province_manager':
      return user.provinceId;
    case 'department_manager':
      return user.departmentId;
    case 'admin':
      return user.adminId;
    default:
      return undefined;
  }
};

/**
 * Get the role_id for API calls
 * @param user - User object with role and role_id
 * @returns The role_id for API calls
 */
export const getUserRoleId = (user: User | null): string | undefined => {
  return user?.role_id;
};

/**
 * Check if user has permission for a specific action
 * @param user - User object
 * @param action - Action to check permission for
 * @returns Boolean indicating if user has permission
 */
export const hasPermission = (user: User | null, action: string): boolean => {
  if (!user) return false;

  switch (action) {
    case 'upload_general_documents':
      return ['school_manager', 'province_manager', 'department_manager'].includes(user.role);
    
    case 'upload_staff_documents':
    case 'upload_students_documents':
    case 'upload_examinations_documents':
      return user.role === 'school_manager';
    
    case 'manage_schools':
      return ['province_manager', 'department_manager', 'admin'].includes(user.role);
    
    case 'manage_provinces':
      return ['department_manager', 'admin'].includes(user.role);
    
    case 'manage_users':
    case 'manage_documents':
    case 'document_indexing':
      return user.role === 'admin';
    
    default:
      return false;
  }
};

/**
 * Get user's display name based on role
 * @param user - User object
 * @param fallback - Fallback name if no specific name is available
 * @returns Display name for the user
 */
export const getUserDisplayName = (user: User | null, fallback: string = 'User'): string => {
  if (!user) return fallback;

  // If we have a specific name from the entity, use it
  // Otherwise, use role-based fallback
  switch (user.role) {
    case 'school_manager':
      return user.name || 'School Manager';
    case 'province_manager':
      return user.name || 'Province Manager';
    case 'department_manager':
      return user.name || 'Department Manager';
    case 'admin':
      return user.name || 'Administrator';
    default:
      return fallback;
  }
};

/**
 * Get the appropriate API endpoint for the user's role
 * @param user - User object
 * @returns API endpoint path
 */
export const getUserApiEndpoint = (user: User | null): string | null => {
  if (!user || !user.role_id) return null;

  switch (user.role) {
    case 'school_manager':
      return `/schools/${user.role_id}`;
    case 'province_manager':
      return `/provinces/${user.role_id}`;
    case 'department_manager':
      return `/departments/${user.role_id}`;
    case 'admin':
      return `/admins/${user.role_id}`;
    default:
      return null;
  }
};

/**
 * Get user's role display name
 * @param role - User role
 * @returns Formatted role display name
 */
export const getRoleDisplayName = (role: string): string => {
  return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
