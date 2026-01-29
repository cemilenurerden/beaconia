import { prisma } from '../utils/prisma.js';

export interface HistoryResult {
  decisions: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function findAll(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<HistoryResult> {
  const skip = (page - 1) * limit;

  const [decisions, total] = await Promise.all([
    prisma.decisionHistory.findMany({
      where: { userId },
      include: {
        selectedActivity: true,
        planBActivity: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.decisionHistory.count({ where: { userId } }),
  ]);

  return {
    decisions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
