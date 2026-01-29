import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';
import { FilterActivitiesInput } from '../validators/activities.validator.js';

export interface ActivitiesResult {
  activities: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function findAll(filter: FilterActivitiesInput): Promise<ActivitiesResult> {
  const { duration, energy, location, cost, social, mood, page, limit } = filter;

  const where: Prisma.ActivityWhereInput = {};

  // Duration filter: durationMin <= duration <= durationMax
  if (duration) {
    where.durationMin = { lte: duration };
    where.durationMax = { gte: duration };
  }

  // Energy level filter
  if (energy) {
    where.energyLevel = energy;
  }

  // Location filter - support 'any' matching both home and outdoor
  if (location) {
    if (location !== 'any') {
      where.OR = [
        { location: location },
        { location: 'any' },
      ];
    }
  }

  // Cost filter
  if (cost) {
    where.cost = cost;
  }

  // Social filter - support 'both' matching solo and friends
  if (social) {
    if (social !== 'both') {
      where.OR = where.OR || [];
      where.OR = [
        { social: social },
        { social: 'both' },
      ];
    }
  }

  // Mood filter
  if (mood) {
    where.moodTags = { has: mood };
  }

  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findById(id: string) {
  return prisma.activity.findUnique({
    where: { id },
  });
}
