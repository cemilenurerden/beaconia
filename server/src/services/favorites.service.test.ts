import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockUser, mockActivity, mockFavorite } from '../__tests__/helpers/fixtures.js';

vi.mock('../utils/prisma.js', () => ({
  prisma: {
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

import { prisma } from '../utils/prisma.js';
import { findAll, add, remove } from './favorites.service.js';

const mockFavFindMany = prisma.favorite.findMany as ReturnType<typeof vi.fn>;
const mockFavFindUnique = prisma.favorite.findUnique as ReturnType<typeof vi.fn>;
const mockFavCreate = prisma.favorite.create as ReturnType<typeof vi.fn>;
const mockFavDelete = prisma.favorite.delete as ReturnType<typeof vi.fn>;
const mockActFindUnique = prisma.activity.findUnique as ReturnType<typeof vi.fn>;

describe('favorites.service - findAll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return activities from favorites', async () => {
    mockFavFindMany.mockResolvedValue([mockFavorite]);
    const result = await findAll(mockUser.id);
    expect(result).toEqual([mockActivity]);
  });

  it('should return empty array when no favorites', async () => {
    mockFavFindMany.mockResolvedValue([]);
    const result = await findAll(mockUser.id);
    expect(result).toEqual([]);
  });

  it('should query with correct userId and include activity', async () => {
    mockFavFindMany.mockResolvedValue([]);
    await findAll(mockUser.id);
    expect(mockFavFindMany).toHaveBeenCalledWith({
      where: { userId: mockUser.id },
      include: { activity: true },
      orderBy: { createdAt: 'desc' },
    });
  });
});

describe('favorites.service - add', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add activity to favorites', async () => {
    mockActFindUnique.mockResolvedValue(mockActivity);
    mockFavFindUnique.mockResolvedValue(null);
    mockFavCreate.mockResolvedValue(mockFavorite);

    const result = await add(mockUser.id, mockActivity.id);
    expect(result).toEqual({ ok: true });
  });

  it('should throw 404 when activity not found', async () => {
    mockActFindUnique.mockResolvedValue(null);

    await expect(
      add(mockUser.id, 'non-existent')
    ).rejects.toThrow('Activity not found');
  });

  it('should throw 409 when already favorited', async () => {
    mockActFindUnique.mockResolvedValue(mockActivity);
    mockFavFindUnique.mockResolvedValue(mockFavorite);

    await expect(
      add(mockUser.id, mockActivity.id)
    ).rejects.toThrow('Activity already in favorites');
  });
});

describe('favorites.service - remove', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should remove favorite successfully', async () => {
    mockFavFindUnique.mockResolvedValue(mockFavorite);
    mockFavDelete.mockResolvedValue(mockFavorite);

    const result = await remove(mockUser.id, mockActivity.id);
    expect(result).toEqual({ ok: true });
  });

  it('should throw 404 when favorite not found', async () => {
    mockFavFindUnique.mockResolvedValue(null);

    await expect(
      remove(mockUser.id, 'non-existent')
    ).rejects.toThrow('Favorite not found');
  });

  it('should delete with correct id', async () => {
    mockFavFindUnique.mockResolvedValue(mockFavorite);
    mockFavDelete.mockResolvedValue(mockFavorite);

    await remove(mockUser.id, mockActivity.id);
    expect(mockFavDelete).toHaveBeenCalledWith({
      where: { id: mockFavorite.id },
    });
  });
});
