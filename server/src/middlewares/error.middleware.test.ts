import { describe, it, expect, vi } from 'vitest';
import { errorMiddleware } from './error.middleware.js';
import { ApiError } from '../types/index.js';

function createMockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const mockReq = {} as any;
const mockNext = vi.fn();

describe('errorMiddleware', () => {
  it('should handle ApiError', () => {
    const res = createMockRes();
    const error = new ApiError(404, 'NOT_FOUND', 'Resource not found', ['detail']);
    errorMiddleware(error, mockReq, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        details: ['detail'],
      },
    });
  });

  it('should handle ApiError with empty details', () => {
    const res = createMockRes();
    const error = new ApiError(401, 'UNAUTHORIZED', 'Auth required');
    errorMiddleware(error, mockReq, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Auth required',
        details: [],
      },
    });
  });

  it('should handle ZodError', () => {
    const res = createMockRes();
    const zodError = new Error('validation');
    zodError.name = 'ZodError';
    (zodError as any).errors = [
      { path: ['email'], message: 'Required' },
    ];
    errorMiddleware(zodError, mockReq, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'BAD_REQUEST',
        message: 'Validation failed',
        details: ['email: Required'],
      },
    });
  });

  it('should handle generic Error with 500 status', () => {
    const res = createMockRes();
    const error = new Error('Something went wrong');
    errorMiddleware(error, mockReq, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL',
        message: 'Something went wrong',
        details: [],
      },
    });
  });

  it('should hide error message in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const res = createMockRes();
    const error = new Error('secret detail');
    errorMiddleware(error, mockReq, res, mockNext);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL',
        message: 'Internal server error',
        details: [],
      },
    });
    process.env.NODE_ENV = originalEnv;
  });
});
