import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware, optionalAuthMiddleware } from './auth.middleware.js';
import { mockUser } from '../__tests__/helpers/fixtures.js';

// Mock dependencies
vi.mock('../utils/jwt.js', () => ({
  extractTokenFromHeader: vi.fn(),
  verifyToken: vi.fn(),
}));

vi.mock('../utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { extractTokenFromHeader, verifyToken } from '../utils/jwt.js';
import { prisma } from '../utils/prisma.js';

const mockExtract = extractTokenFromHeader as ReturnType<typeof vi.fn>;
const mockVerify = verifyToken as ReturnType<typeof vi.fn>;
const mockFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>;

function createMockReq(authHeader?: string) {
  return {
    headers: { authorization: authHeader },
    user: undefined,
  } as any;
}

function createMockRes() {
  return {} as any;
}

describe('authMiddleware', () => {
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call next with error when no token', async () => {
    mockExtract.mockReturnValue(null);
    const req = createMockReq();
    await authMiddleware(req, createMockRes(), next);
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Authentication required');
  });

  it('should call next with error when token is invalid', async () => {
    mockExtract.mockReturnValue('bad-token');
    mockVerify.mockReturnValue(null);
    const req = createMockReq('Bearer bad-token');
    await authMiddleware(req, createMockRes(), next);
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Invalid or expired token');
  });

  it('should call next with error when user not found', async () => {
    mockExtract.mockReturnValue('valid-token');
    mockVerify.mockReturnValue({ sub: 'non-existent' });
    mockFindUnique.mockResolvedValue(null);
    const req = createMockReq('Bearer valid-token');
    await authMiddleware(req, createMockRes(), next);
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('User not found');
  });

  it('should attach user and call next on success', async () => {
    mockExtract.mockReturnValue('valid-token');
    mockVerify.mockReturnValue({ sub: mockUser.id });
    mockFindUnique.mockResolvedValue({ id: mockUser.id, email: mockUser.email });
    const req = createMockReq('Bearer valid-token');
    await authMiddleware(req, createMockRes(), next);
    expect(req.user).toEqual({ id: mockUser.id, email: mockUser.email });
    expect(next).toHaveBeenCalledWith();
  });

  it('should query user with correct where clause', async () => {
    mockExtract.mockReturnValue('valid-token');
    mockVerify.mockReturnValue({ sub: mockUser.id });
    mockFindUnique.mockResolvedValue({ id: mockUser.id, email: mockUser.email });
    const req = createMockReq('Bearer valid-token');
    await authMiddleware(req, createMockRes(), next);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      select: { id: true, email: true },
    });
  });
});

describe('optionalAuthMiddleware', () => {
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call next without user when no token', async () => {
    mockExtract.mockReturnValue(null);
    const req = createMockReq();
    await optionalAuthMiddleware(req, createMockRes(), next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should call next without user when token is invalid', async () => {
    mockExtract.mockReturnValue('bad-token');
    mockVerify.mockReturnValue(null);
    const req = createMockReq('Bearer bad-token');
    await optionalAuthMiddleware(req, createMockRes(), next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should attach user when token is valid', async () => {
    mockExtract.mockReturnValue('valid-token');
    mockVerify.mockReturnValue({ sub: mockUser.id });
    mockFindUnique.mockResolvedValue({ id: mockUser.id, email: mockUser.email });
    const req = createMockReq('Bearer valid-token');
    await optionalAuthMiddleware(req, createMockRes(), next);
    expect(req.user).toEqual({ id: mockUser.id, email: mockUser.email });
    expect(next).toHaveBeenCalled();
  });

  it('should call next without user when user not found in DB', async () => {
    mockExtract.mockReturnValue('valid-token');
    mockVerify.mockReturnValue({ sub: 'non-existent' });
    mockFindUnique.mockResolvedValue(null);
    const req = createMockReq('Bearer valid-token');
    await optionalAuthMiddleware(req, createMockRes(), next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
