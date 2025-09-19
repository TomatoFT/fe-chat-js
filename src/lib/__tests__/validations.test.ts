import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  userCreateSchema,
  chatSendSchema,
  documentUploadSchema,
} from '../validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      };
      
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role_id: 1,
      };
      
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should validate without optional fields', () => {
      const validData = {
        email: 'john@example.com',
        password: 'password123',
      };
      
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });
  });

  describe('userCreateSchema', () => {
    it('should validate correct user creation data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        role_id: 1,
      };
      
      expect(() => userCreateSchema.parse(validData)).not.toThrow();
    });

    it('should validate with only required fields', () => {
      const validData = {
        email: 'john@example.com',
      };
      
      expect(() => userCreateSchema.parse(validData)).not.toThrow();
    });
  });

  describe('chatSendSchema', () => {
    it('should validate correct chat message data', () => {
      const validData = {
        message: 'Hello, world!',
        session_id: '123e4567-e89b-12d3-a456-426614174000',
      };
      
      expect(() => chatSendSchema.parse(validData)).not.toThrow();
    });

    it('should validate without session_id', () => {
      const validData = {
        message: 'Hello, world!',
      };
      
      expect(() => chatSendSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty message', () => {
      const invalidData = {
        message: '',
      };
      
      expect(() => chatSendSchema.parse(invalidData)).toThrow();
    });
  });

  describe('documentUploadSchema', () => {
    it('should validate correct document upload data', () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const validData = {
        file: mockFile,
        title: 'Test Document',
        description: 'A test document',
      };
      
      expect(() => documentUploadSchema.parse(validData)).not.toThrow();
    });

    it('should validate with only required file', () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const validData = {
        file: mockFile,
      };
      
      expect(() => documentUploadSchema.parse(validData)).not.toThrow();
    });

    it('should reject without file', () => {
      const invalidData = {
        title: 'Test Document',
      };
      
      expect(() => documentUploadSchema.parse(invalidData)).toThrow();
    });
  });
});
