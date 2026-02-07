import { describe, it, expect, vi } from 'vitest';
import { sendSuccess, sendError, HttpStatus, getErrorCode } from './response.js';

// Helper to create a mock Express Response
function createMockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('sendSuccess', () => {
  it('should send data with default 200 status', () => {
    const res = createMockResponse();
    sendSuccess(res, { message: 'hello' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'hello' } });
  });

  it('should send data with custom status code', () => {
    const res = createMockResponse();
    sendSuccess(res, { id: '123' }, 201);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: { id: '123' } });
  });

  it('should handle null data', () => {
    const res = createMockResponse();
    sendSuccess(res, null);
    expect(res.json).toHaveBeenCalledWith({ data: null });
  });

  it('should handle array data', () => {
    const res = createMockResponse();
    sendSuccess(res, [1, 2, 3]);
    expect(res.json).toHaveBeenCalledWith({ data: [1, 2, 3] });
  });

  it('should handle string data', () => {
    const res = createMockResponse();
    sendSuccess(res, 'ok');
    expect(res.json).toHaveBeenCalledWith({ data: 'ok' });
  });
});

describe('sendError', () => {
  it('should send error response with all fields', () => {
    const res = createMockResponse();
    sendError(res, 'BAD_REQUEST', 'Invalid input', 400, ['field: required']);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
        details: ['field: required'],
      },
    });
  });

  it('should default details to empty array', () => {
    const res = createMockResponse();
    sendError(res, 'NOT_FOUND', 'Not found', 404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'NOT_FOUND',
        message: 'Not found',
        details: [],
      },
    });
  });

  it('should handle 401 status', () => {
    const res = createMockResponse();
    sendError(res, 'UNAUTHORIZED', 'Auth required', 401);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should handle 500 status', () => {
    const res = createMockResponse();
    sendError(res, 'INTERNAL', 'Server error', 500);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should handle multiple details', () => {
    const res = createMockResponse();
    sendError(res, 'BAD_REQUEST', 'Validation', 400, ['email: required', 'password: too short']);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'BAD_REQUEST',
        message: 'Validation',
        details: ['email: required', 'password: too short'],
      },
    });
  });
});

describe('HttpStatus', () => {
  it('should have correct status code values', () => {
    expect(HttpStatus.OK).toBe(200);
    expect(HttpStatus.CREATED).toBe(201);
    expect(HttpStatus.BAD_REQUEST).toBe(400);
    expect(HttpStatus.UNAUTHORIZED).toBe(401);
    expect(HttpStatus.FORBIDDEN).toBe(403);
    expect(HttpStatus.NOT_FOUND).toBe(404);
    expect(HttpStatus.CONFLICT).toBe(409);
    expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
  });
});

describe('getErrorCode', () => {
  it('should return BAD_REQUEST for 400', () => {
    expect(getErrorCode(400)).toBe('BAD_REQUEST');
  });

  it('should return UNAUTHORIZED for 401', () => {
    expect(getErrorCode(401)).toBe('UNAUTHORIZED');
  });

  it('should return FORBIDDEN for 403', () => {
    expect(getErrorCode(403)).toBe('FORBIDDEN');
  });

  it('should return NOT_FOUND for 404', () => {
    expect(getErrorCode(404)).toBe('NOT_FOUND');
  });

  it('should return CONFLICT for 409', () => {
    expect(getErrorCode(409)).toBe('CONFLICT');
  });

  it('should return INTERNAL for 500', () => {
    expect(getErrorCode(500)).toBe('INTERNAL');
  });

  it('should return INTERNAL for unknown status codes', () => {
    expect(getErrorCode(418)).toBe('INTERNAL');
    expect(getErrorCode(503)).toBe('INTERNAL');
  });
});
