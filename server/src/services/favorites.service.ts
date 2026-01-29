import { prisma } from '../utils/prisma.js';
import { ApiError } from '../types/index.js';

export async function findAll(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      activity: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return favorites.map((f) => f.activity);
}

export async function add(userId: string, activityId: string) {
  // Check if activity exists
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new ApiError(404, 'NOT_FOUND', 'Activity not found');
  }

  // Check if already favorited
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_activityId: { userId, activityId },
    },
  });

  if (existing) {
    throw new ApiError(409, 'CONFLICT', 'Activity already in favorites');
  }

  await prisma.favorite.create({
    data: {
      userId,
      activityId,
    },
  });

  return { ok: true };
}

export async function remove(userId: string, activityId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_activityId: { userId, activityId },
    },
  });

  if (!favorite) {
    throw new ApiError(404, 'NOT_FOUND', 'Favorite not found');
  }

  await prisma.favorite.delete({
    where: { id: favorite.id },
  });

  return { ok: true };
}
