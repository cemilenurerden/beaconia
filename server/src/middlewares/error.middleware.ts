import { Request, Response, NextFunction } from 'express';
import { sendError, getErrorCode } from '../utils/response.js';
import { ApiError } from '../types/index.js';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  // Handle ApiError
  if (err instanceof ApiError) {
    sendError(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  // Handle validation errors (from Zod)
  if (err.name === 'ZodError') {
    const zodError = err as any;
    const details = zodError.errors?.map((e: any) => `${e.path.join('.')}: ${e.message}`) || [];
    sendError(res, 'BAD_REQUEST', 'Validation failed', 400, details);
    return;
  }

  // Default error
  const statusCode = 500;
  const code = getErrorCode(statusCode);
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';

  sendError(res, code, message, statusCode);
}
