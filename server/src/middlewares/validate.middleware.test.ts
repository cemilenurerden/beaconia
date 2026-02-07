import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { validate, validateBody, validateQuery } from './validate.middleware.js';

function createMockReq(body: any = {}, query: any = {}) {
  return { body, query, params: {} } as any;
}

function createMockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const testSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(0),
});

describe('validate', () => {
  it('should call next when body is valid', () => {
    const middleware = validate(testSchema, 'body');
    const req = createMockReq({ name: 'Test', age: 25 });
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeUndefined();
  });

  it('should replace body with parsed data', () => {
    const schema = z.object({ name: z.string().trim() });
    const middleware = validate(schema, 'body');
    const req = createMockReq({ name: '  hello  ' });
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);
    expect(req.body.name).toBe('hello');
  });

  it('should return 400 with details on validation error', () => {
    const middleware = validate(testSchema, 'body');
    const req = createMockReq({ name: '', age: -1 });
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    const body = res.json.mock.calls[0][0];
    expect(body.error.code).toBe('BAD_REQUEST');
    expect(body.error.details.length).toBeGreaterThan(0);
  });

  it('should pass non-Zod errors to next', () => {
    const badSchema = {
      parse: () => { throw new Error('something else'); },
    } as any;
    const middleware = validate(badSchema, 'body');
    const req = createMockReq({});
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('validateBody', () => {
  it('should validate request body', () => {
    const middleware = validateBody(testSchema);
    const req = createMockReq({ name: 'Test', age: 25 });
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('validateQuery', () => {
  it('should validate request query', () => {
    const querySchema = z.object({ page: z.coerce.number().default(1) });
    const middleware = validateQuery(querySchema);
    const req = createMockReq({}, { page: '2' });
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);
    expect(req.query.page).toBe(2);
    expect(next).toHaveBeenCalled();
  });
});
