import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockUser, mockDecision } from '../__tests__/helpers/fixtures.js';

vi.mock('../utils/prisma.js', () => ({
  prisma: {
    decisionHistory: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from '../utils/prisma.js';
import { findAll } from './history.service.js';

const mockFindMany = prisma.decisionHistory.findMany as ReturnType<typeof vi.fn>;
const mockCount = prisma.decisionHistory.count as ReturnType<typeof vi.fn>;

describe('history.service - findAll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return paginated decision history', async () => {
    mockFindMany.mockResolvedValue([mockDecision]);
    mockCount.mockResolvedValue(1);

    const result = await findAll(mockUser.id, 1, 20);
    expect(result.decisions).toHaveLength(1);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.totalPages).toBe(1);
  });

  it('should use default pagination values', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const result = await findAll(mockUser.id);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(20);
  });

  it('should include selected and planB activities', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await findAll(mockUser.id, 1, 10);
    const call = mockFindMany.mock.calls[0][0];
    expect(call.include).toEqual({
      selectedActivity: true,
      planBActivity: true,
    });
  });

  it('should calculate skip and totalPages correctly', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(35);

    const result = await findAll(mockUser.id, 2, 10);
    const call = mockFindMany.mock.calls[0][0];
    expect(call.skip).toBe(10);
    expect(call.take).toBe(10);
    expect(result.pagination.totalPages).toBe(4);
  });
});
