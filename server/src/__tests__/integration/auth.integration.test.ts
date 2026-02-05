import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

// Mock dependencies
vi.mock('argon2', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    verify: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue('hashed-password'),
  verify: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from '../../utils/prisma.js';
import * as argon2 from 'argon2';

const mockFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>;
const mockCreate = prisma.user.create as ReturnType<typeof vi.fn>;

const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  passwordHash: 'hashed-password',
  city: 'Istanbul',
  createdAt: new Date('2024-01-01'),
};

describe('POST /auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register a new user and return 201', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: '123456', city: 'Istanbul' });

    expect(res.status).toBe(201);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  it('should return 409 when email already exists', async () => {
    mockFindUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('should return 400 for invalid email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'invalid', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('should return 400 for short password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: '123' });

    expect(res.status).toBe(400);
  });

  it('should return 400 for missing body', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login successfully and return 200', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    (argon2.verify as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  it('should return 401 for wrong credentials', async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'unknown@example.com', password: '123456' });

    expect(res.status).toBe(401);
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'not-email', password: '123456' });

    expect(res.status).toBe(400);
  });

  it('should return 400 for missing password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
  });
});
