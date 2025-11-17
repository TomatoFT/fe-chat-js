import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { setGlobalLogout } from '../lib/errorHandler';
import { clearAuthToken } from '../lib/api-client';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, provinceId: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check for stored user session and token
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Make real API call to backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const tokenData = await response.json();
      
      // Store token
      localStorage.setItem('token', tokenData.access_token);
      
      // Get user info
      const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();
      
      // Map role_id to appropriate entity ID based on role
      const getEntityId = (role: string, roleId: string) => {
        switch (role) {
          case 'school_manager':
            return { schoolId: roleId };
          case 'province_manager':
            return { provinceId: roleId };
          case 'department_manager':
            return { departmentId: roleId };
          case 'admin':
            return { adminId: roleId };
          default:
            return {};
        }
      };
      
      const user: User = {
        id: userData.id,
        role: userData.role || 'school_manager',
        role_id: userData.role_id,
        ...getEntityId(userData.role, userData.role_id),
        createdAt: userData.created_at || new Date().toISOString(),
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Invalidate all queries to ensure fresh data is fetched for the new user
      queryClient.invalidateQueries();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, _provinceId: string) => {
    setLoading(true);
    
    try {
      // Make real API call to backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role_id: 1 // Default role for school
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const userData = await response.json();
      
      // Map role_id to appropriate entity ID based on role
      const getEntityId = (role: string, roleId: string) => {
        switch (role) {
          case 'school_manager':
            return { schoolId: roleId };
          case 'province_manager':
            return { provinceId: roleId };
          case 'department_manager':
            return { departmentId: roleId };
          case 'admin':
            return { adminId: roleId };
          default:
            return {};
        }
      };
      
      const user: User = {
        id: userData.id,
        role: userData.role || 'school_manager',
        role_id: userData.role_id,
        ...getEntityId(userData.role, userData.role_id),
        createdAt: userData.created_at || new Date().toISOString(),
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    clearAuthToken();
    
    // Clear all cached queries
    queryClient.clear();
  };

  // Register global logout function for error handling
  useEffect(() => {
    setGlobalLogout(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};