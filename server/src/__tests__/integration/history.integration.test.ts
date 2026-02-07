import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { mockUser, mockDecision } from '../helpers/fixtures.js';
import { generateToken } from '../../utils/jwt.js';

vi.mock('../../utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    decisionHistory: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from '../../utils/prisma.js';

const mockUserFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>;
const mockFindMany = prisma.decisionHistory.findMany as ReturnType<typeof vi.fn>;
const mockCount = prisma.decisionHistory.count as ReturnType<typeof vi.fn>;

const authToken = generateToken(mockUser.id);

describe('GET /history', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserFindUnique.mockResolvedValue({ id: mockUser.id, email: mockUser.email });
  });

  it('should return 200 with paginated history', async () => {
    mockFindMany.mockResolvedValue([mockDecision]);
    mockCount.mockResolvedValue(1);

    const res = await request(app)
      .get('/history')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.decisions).toHaveLength(1);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app).get('/history');
    expect(res.status).toBe(401);
  });

  it('should support pagination query params', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const res = await request(app)
      .get('/history')
      .query({ page: 2, limit: 5 })
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.pagination.page).toBe(2);
  });
});
