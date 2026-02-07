import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { mockUser, mockActivity, mockFavorite } from '../helpers/fixtures.js';
import { generateToken } from '../../utils/jwt.js';

vi.mock('../../utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    activity: {
      findUnique: vi.fn(),
    },
    favorite: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from '../../utils/prisma.js';

const mockUserFindUnique = prisma.user.findUnique as ReturnType<typeof vi.fn>;
const mockActFindUnique = prisma.activity.findUnique as ReturnType<typeof vi.fn>;
const mockFavFindMany = prisma.favorite.findMany as ReturnType<typeof vi.fn>;
const mockFavFindUnique = prisma.favorite.findUnique as ReturnType<typeof vi.fn>;
const mockFavCreate = prisma.favorite.create as ReturnType<typeof vi.fn>;
const mockFavDelete = prisma.favorite.delete as ReturnType<typeof vi.fn>;

// Generate a real token for the mock user
const authToken = generateToken(mockUser.id);

describe('GET /favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserFindUnique.mockResolvedValue({ id: mockUser.id, email: mockUser.email });
  });

  it('should return 200 with favorites', async () => {
    mockFavFindMany.mockResolvedValue([mockFavorite]);

    const res = await request(app)
      .get('/favorites')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app).get('/favorites');
    expect(res.status).toBe(401);
  });

  it('should return empty array when no favorites', async () => {
    mockFavFindMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/favorites')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe('POST /favorites/:activityId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserFindUnique.mockResolvedValue({ id: mockUser.id, email: mockUser.email });
  });

  it('should add favorite and return 201', async () => {
    mockActFindUnique.mockResolvedValue(mockActivity);
    mockFavFindUnique.mockResolvedValue(null);
    mockFavCreate.mockResolvedValue(mockFavorite);

    const res = await request(app)
      .post(`/favorites/${mockActivity.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.data.ok).toBe(true);
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app)
      .post(`/favorites/${mockActivity.id}`);
    expect(res.status).toBe(401);
  });

  it('should return 409 for duplicate favorite', async () => {
    mockActFindUnique.mockResolvedValue(mockActivity);
    mockFavFindUnique.mockResolvedValue(mockFavorite);

    const res = await request(app)
      .post(`/favorites/${mockActivity.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(409);
  });
});

describe('DELETE /favorites/:activityId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserFindUnique.mockResolvedValue({ id: mockUser.id, email: mockUser.email });
  });

  it('should remove favorite and return 200', async () => {
    mockFavFindUnique.mockResolvedValue(mockFavorite);
    mockFavDelete.mockResolvedValue(mockFavorite);

    const res = await request(app)
      .delete(`/favorites/${mockActivity.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.ok).toBe(true);
  });

  it('should return 404 when favorite not found', async () => {
    mockFavFindUnique.mockResolvedValue(null);

    const res = await request(app)
      .delete(`/favorites/${mockActivity.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });
});
