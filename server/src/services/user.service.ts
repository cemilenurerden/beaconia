import { prisma } from '../utils/prisma.js';

export interface UserStats {
  dailyCompleted: number;
  dailyGoal: number;
  streak: number;
}

export interface UserPreferences {
  duration: number;
  energy: string;
  location: string;
  cost: string;
  social: string;
  mood: string;
}

export async function getStats(userId: string): Promise<UserStats> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const dailyCompleted = await prisma.decisionHistory.count({
    where: {
      userId,
      createdAt: { gte: todayStart },
    },
  });

  const streak = await calculateStreak(userId);

  return {
    dailyCompleted,
    dailyGoal: 3,
    streak,
  };
}

async function calculateStreak(userId: string): Promise<number> {
  // Get distinct dates with activity (ordered descending)
  const decisions = await prisma.decisionHistory.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  if (decisions.length === 0) return 0;

  // Extract unique dates (YYYY-MM-DD)
  const uniqueDates = [
    ...new Set(
      decisions.map((d) => {
        const date = new Date(d.createdAt);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
    ),
  ];

  // Check if today or yesterday is the most recent date
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }

  // Count consecutive days
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i - 1]);
    const prev = new Date(uniqueDates[i]);
    const diffMs = current.getTime() - prev.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function getPreferences(userId: string): Promise<UserPreferences | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  return (user?.preferences as unknown as UserPreferences) ?? null;
}

export async function updatePreferences(
  userId: string,
  preferences: UserPreferences
): Promise<UserPreferences> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { preferences: preferences as any },
    select: { preferences: true },
  });

  return user.preferences as unknown as UserPreferences;
}
