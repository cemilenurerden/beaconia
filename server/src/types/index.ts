import { Request } from 'express';

// User payload attached to request after auth middleware
export interface UserPayload {
  id: string;
  email: string;
}

// Extended Request with user
export interface AuthRequest extends Request {
  user?: UserPayload;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Error
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details: string[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Service result types
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode: number;
  };
}
