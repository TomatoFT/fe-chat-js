import { clearAuthToken } from './api-client';

// Global logout function that can be set by the auth context
let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (logoutFn: () => void) => {
  globalLogout = logoutFn;
};

export const handleAuthError = (response: Response) => {
  if (response.status === 401) {
    // Clear the token from OpenAPI client
    clearAuthToken();
    
    // Clear localStorage tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Trigger global logout if available
    if (globalLogout) {
      globalLogout();
    }
    
    // Redirect to login page
    window.location.href = '/login';
    
    return true; // Indicates that logout was triggered
  }
  return false; // No logout needed
};

export const isAuthError = (response: Response): boolean => {
  return response.status === 401;
};

