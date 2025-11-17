// Configure the OpenAPI client before importing
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000';

// Debug logging
console.log('Environment VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('API Client will be configured with base URL:', apiBaseUrl);

// Import and configure OpenAPI
import { OpenAPI } from '../api-client';

OpenAPI.BASE = apiBaseUrl;

console.log('OpenAPI.BASE set to:', OpenAPI.BASE);

// Set up authentication token
export const setAuthToken = (token: string) => {
  OpenAPI.TOKEN = token;
};

// Clear authentication token
export const clearAuthToken = () => {
  OpenAPI.TOKEN = undefined;
};

// Get current token
export const getAuthToken = () => {
  return OpenAPI.TOKEN;
};

export { OpenAPI };
