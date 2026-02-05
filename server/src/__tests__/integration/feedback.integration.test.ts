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
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from '../../utils/prisma.js';

const mockUserFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>;
const mockDecisionFindUnique = prisma.decisionHistory.findUnique as ReturnType<typeof vi.fn>;
const mockDecisionUpdate = prisma.decisionHistory.update as ReturnType<typeof vi.fn>;

const authToken = generateToken(mockUser.id);

describe('POST /feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserFindUnique.mockResolvedValue({ id: mockUser.id, email: mockUser.email });
  });

  it('should submit feedback and return 201', async () => {
    mockDecisionFindUnique.mockResolvedValue(mockDecision);
    mockDecisionUpdate.mockResolvedValue({});

    const res = await request(app)
      .post('/feedback')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ decisionId: mockDecision.id, feedback: 'up' });

    expect(res.status).toBe(201);
    expect(res.body.data.ok).toBe(true);
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/feedback')
      .send({ decisionId: mockDecision.id, feedback: 'up' });

    expect(res.status).toBe(401);
  });

  it('should return 400 for invalid body', async () => {
    const res = await request(app)
      .post('/feedback')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ decisionId: 'not-uuid', feedback: 'invalid' });

    expect(res.status).toBe(400);
  });

  it('should return 404 when decision not found', async () => {
    mockDecisionFindUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/feedback')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ decisionId: '550e8400-e29b-41d4-a716-446655440099', feedback: 'up' });

    expect(res.status).toBe(404);
  });

  it('should return 403 for another users decision', async () => {
    mockDecisionFindUnique.mockResolvedValue({ ...mockDecision, userId: 'other-user-id' });

    const res = await request(app)
      .post('/feedback')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ decisionId: mockDecision.id, feedback: 'down' });

    expect(res.status).toBe(403);
  });
});
