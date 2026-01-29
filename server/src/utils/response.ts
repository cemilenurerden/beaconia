import { Response } from 'express';

interface SuccessResponse<T> {
  data: T;
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details: string[];
  };
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const response: SuccessResponse<T> = { data };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode: number,
  details: string[] = []
): void {
  const response: ErrorResponse = {
    error: {
      code,
      message,
      details,
    },
  };
  res.status(statusCode).json(response);
}

// HTTP Status Code helpers
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error code mapping
export function getErrorCode(statusCode: number): string {
  const codeMap: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    500: 'INTERNAL',
  };
  return codeMap[statusCode] || 'INTERNAL';
}
