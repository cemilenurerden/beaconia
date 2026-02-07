import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockUser } from '../__tests__/helpers/fixtures.js';

// Mock dependencies
vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  verify: vi.fn(),
}));

vi.mock('../utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('../utils/jwt.js', () => ({
  generateToken: vi.fn().mockReturnValue('mock-jwt-token'),
}));

import * as argon2 from 'argon2';
import { prisma } from '../utils/prisma.js';
import { register, login } from './auth.service.js';

const mockFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>;
const mockCreate = prisma.user.create as ReturnType<typeof vi.fn>;
const mockArgonVerify = argon2.verify as ReturnType<typeof vi.fn>;

describe('auth.service - register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue(mockUser);

    const result = await register({ email: 'test@example.com', password: '123456', city: 'Istanbul' });
    expect(result.accessToken).toBe('mock-jwt-token');
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.id).toBe(mockUser.id);
  });

  it('should throw 409 if email already registered', async () => {
    mockFindUnique.mockResolvedValue(mockUser);

    await expect(
      register({ email: 'test@example.com', password: '123456' })
    ).rejects.toThrow('Email already registered');
  });

  it('should hash the password before storing', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue(mockUser);

    await register({ email: 'test@example.com', password: 'mypassword' });
    expect(argon2.hash).toHaveBeenCalledWith('mypassword');
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        city: undefined,
      },
    });
  });

  it('should return user without passwordHash', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue(mockUser);

    const result = await register({ email: 'test@example.com', password: '123456' });
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.user).toHaveProperty('id');
    expect(result.user).toHaveProperty('email');
    expect(result.user).toHaveProperty('createdAt');
  });
});

describe('auth.service - login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    mockArgonVerify.mockResolvedValue(true);

    const result = await login({ email: 'test@example.com', password: '123456' });
    expect(result.accessToken).toBe('mock-jwt-token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw 401 if user not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(
      login({ email: 'unknown@example.com', password: '123456' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw 401 if password is wrong', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    mockArgonVerify.mockResolvedValue(false);

    await expect(
      login({ email: 'test@example.com', password: 'wrongpass' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should verify password with argon2', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    mockArgonVerify.mockResolvedValue(true);

    await login({ email: 'test@example.com', password: 'mypassword' });
    expect(argon2.verify).toHaveBeenCalledWith(mockUser.passwordHash, 'mypassword');
  });
});
