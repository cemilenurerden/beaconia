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

// ---- Profile Analysis ----

export interface ProfileAnalysis {
  totalActivities: number;
  longestStreak: number;
  favoriteActivity: string;
  weeklyHours: number;
  categoryDistribution: { category: string; percentage: number }[];
  topEnergy: string;
  topLocation: string;
  topSocial: string;
  topMoods: string[];
}

export async function getProfileAnalysis(userId: string): Promise<ProfileAnalysis> {
  const decisions = await prisma.decisionHistory.findMany({
    where: { userId },
    include: { selectedActivity: true },
    orderBy: { createdAt: 'desc' },
  });

  const totalActivities = decisions.length;

  // Longest streak (all-time)
  const longestStreak = calculateLongestStreak(decisions.map((d) => d.createdAt));

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  decisions.forEach((d) => {
    const cat = d.selectedActivity.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoryDistribution = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      percentage: totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Top energy / location / social / mood from inputJson
  const energyCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  const socialCounts: Record<string, number> = {};
  const moodCounts: Record<string, number> = {};

  decisions.forEach((d) => {
    const input = d.inputJson as any;
    if (input?.energy) energyCounts[input.energy] = (energyCounts[input.energy] || 0) + 1;
    if (input?.location) locationCounts[input.location] = (locationCounts[input.location] || 0) + 1;
    if (input?.social) socialCounts[input.social] = (socialCounts[input.social] || 0) + 1;
    if (input?.mood) moodCounts[input.mood] = (moodCounts[input.mood] || 0) + 1;
  });

  const topOf = (counts: Record<string, number>) =>
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  const energyMap: Record<string, string> = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };
  const locationMap: Record<string, string> = { outdoor: 'Dışarıda', home: 'Evde', any: 'Farketmez' };
  const socialMap: Record<string, string> = { solo: 'Tek başına', friends: 'Arkadaşlarla', both: 'Karışık' };

  const topEnergy = energyMap[topOf(energyCounts)] || 'Orta';
  const topLocation = locationMap[topOf(locationCounts)] || 'Farketmez';
  const topSocial = socialMap[topOf(socialCounts)] || 'Karışık';

  // Top 5 moods
  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([mood]) => mood);

  // Favorite activity from Favorite table
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { activity: true },
  });
  const favCategoryCounts: Record<string, { count: number; title: string }> = {};
  favorites.forEach((f) => {
    const cat = f.activity.category;
    if (!favCategoryCounts[cat]) {
      favCategoryCounts[cat] = { count: 0, title: f.activity.title };
    }
    favCategoryCounts[cat].count++;
  });
  const favoriteActivity =
    Object.values(favCategoryCounts).sort((a, b) => b.count - a.count)[0]?.title ?? '';

  // Weekly hours
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weeklyDecisions = decisions.filter((d) => new Date(d.createdAt) >= weekStart);
  const avgDuration =
    weeklyDecisions.length > 0
      ? weeklyDecisions.reduce((sum, d) => {
          const act = d.selectedActivity;
          return sum + (act.durationMin + act.durationMax) / 2;
        }, 0) / weeklyDecisions.length
      : 0;
  const weeklyHours = Math.round((avgDuration * weeklyDecisions.length) / 60);

  return {
    totalActivities,
    longestStreak,
    favoriteActivity,
    weeklyHours,
    categoryDistribution,
    topEnergy,
    topLocation,
    topSocial,
    topMoods,
  };
}

function calculateLongestStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const uniqueDates = [
    ...new Set(
      dates.map((d) => {
        const date = new Date(d);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
    ),
  ].sort();

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
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
