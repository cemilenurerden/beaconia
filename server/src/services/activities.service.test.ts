import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockActivity, mockActivity2 } from '../__tests__/helpers/fixtures.js';

vi.mock('../utils/prisma.js', () => ({
  prisma: {
    activity: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from '../utils/prisma.js';
import { findAll, findById } from './activities.service.js';

const mockFindMany = prisma.activity.findMany as ReturnType<typeof vi.fn>;
const mockCount = prisma.activity.count as ReturnType<typeof vi.fn>;
const mockFindUnique = prisma.activity.findUnique as ReturnType<typeof vi.fn>;

describe('activities.service - findAll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return paginated activities with default params', async () => {
    mockFindMany.mockResolvedValue([mockActivity, mockActivity2]);
    mockCount.mockResolvedValue(2);

    const result = await findAll({ page: 1, limit: 20 });
    expect(result.activities).toHaveLength(2);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(20);
    expect(result.pagination.total).toBe(2);
    expect(result.pagination.totalPages).toBe(1);
  });

  it('should calculate totalPages correctly', async () => {
    mockFindMany.mockResolvedValue([mockActivity]);
    mockCount.mockResolvedValue(25);

    const result = await findAll({ page: 1, limit: 10 });
    expect(result.pagination.totalPages).toBe(3);
  });

  it('should apply duration filter', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 1, limit: 20, duration: 30 });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.durationMin).toEqual({ lte: 30 });
    expect(call.where.durationMax).toEqual({ gte: 30 });
  });

  it('should apply energy filter', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 1, limit: 20, energy: 'low' });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.energyLevel).toBe('low');
  });

  it('should apply location filter with OR for non-any', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 1, limit: 20, location: 'home' });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.OR).toEqual([
      { location: 'home' },
      { location: 'any' },
    ]);
  });

  it('should not apply OR for location "any"', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 1, limit: 20, location: 'any' });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.OR).toBeUndefined();
  });

  it('should apply cost filter', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 1, limit: 20, cost: 'free' });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.cost).toBe('free');
  });

  it('should apply social filter with OR for non-both', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 1, limit: 20, social: 'solo' });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.OR).toEqual([
      { social: 'solo' },
      { social: 'both' },
    ]);
  });

  it('should apply mood filter', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 1, limit: 20, mood: 'stressed' });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.moodTags).toEqual({ has: 'stressed' });
  });

  it('should calculate skip correctly for pagination', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 3, limit: 10 });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.skip).toBe(20);
    expect(call.take).toBe(10);
  });

  it('should order by createdAt desc', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll({ page: 1, limit: 20 });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.orderBy).toEqual({ createdAt: 'desc' });
  });
});

describe('activities.service - findById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return activity by id', async () => {
    mockFindUnique.mockResolvedValue(mockActivity);
    const result = await findById(mockActivity.id);
    expect(result).toEqual(mockActivity);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: mockActivity.id } });
  });

  it('should return null for non-existent id', async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await findById('non-existent');
    expect(result).toBeNull();
  });
});
