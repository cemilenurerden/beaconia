import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { mockActivity, mockActivity2 } from '../helpers/fixtures.js';

vi.mock('../../utils/prisma.js', () => ({
  prisma: {
    activity: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '../../utils/prisma.js';

const mockFindMany = prisma.activity.findMany as ReturnType<typeof vi.fn>;
const mockCount = prisma.activity.count as ReturnType<typeof vi.fn>;

describe('GET /activities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 with activities list', async () => {
    mockFindMany.mockResolvedValue([mockActivity, mockActivity2]);
    mockCount.mockResolvedValue(2);

    const res = await request(app).get('/activities');
    expect(res.status).toBe(200);
    expect(res.body.data.activities).toHaveLength(2);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('should support query filters', async () => {
    mockFindMany.mockResolvedValue([mockActivity]);
    mockCount.mockResolvedValue(1);

    const res = await request(app)
      .get('/activities')
      .query({ energy: 'low', location: 'home' });

    expect(res.status).toBe(200);
  });

  it('should return 400 for invalid filter values', async () => {
    const res = await request(app)
      .get('/activities')
      .query({ energy: 'extreme' });

    expect(res.status).toBe(400);
  });

  it('should support pagination query', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const res = await request(app)
      .get('/activities')
      .query({ page: 2, limit: 5 });

    expect(res.status).toBe(200);
    expect(res.body.data.pagination.page).toBe(2);
    expect(res.body.data.pagination.limit).toBe(5);
  });
});
