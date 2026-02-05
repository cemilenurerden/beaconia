import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { mockActivity, mockActivity2 } from '../helpers/fixtures.js';

vi.mock('../../utils/prisma.js', () => ({
  prisma: {
    activity: {
      findMany: vi.fn(),
    },
    decisionHistory: {
      create: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '../../utils/prisma.js';

const mockFindMany = prisma.activity.findMany as ReturnType<typeof vi.fn>;

const validBody = {
  duration: 30,
  energy: 'low',
  location: 'home',
  cost: 'free',
  social: 'solo',
};

describe('POST /recommend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 with recommendation', async () => {
    mockFindMany.mockResolvedValue([mockActivity, mockActivity2]);

    const res = await request(app)
      .post('/recommend')
      .send(validBody);

    expect(res.status).toBe(200);
    expect(res.body.data.selected).toBeDefined();
    expect(res.body.data.reason).toBeDefined();
    expect(res.body.data.firstStep).toBeDefined();
  });

  it('should return 404 when no matching activities', async () => {
    mockFindMany.mockResolvedValue([]);

    const res = await request(app)
      .post('/recommend')
      .send(validBody);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('should return 400 for invalid body', async () => {
    const res = await request(app)
      .post('/recommend')
      .send({ duration: 30 });

    expect(res.status).toBe(400);
  });

  it('should work without authentication', async () => {
    mockFindMany.mockResolvedValue([mockActivity]);

    const res = await request(app)
      .post('/recommend')
      .send(validBody);

    expect(res.status).toBe(200);
    expect(res.body.data.decisionId).toBeNull();
  });
});
