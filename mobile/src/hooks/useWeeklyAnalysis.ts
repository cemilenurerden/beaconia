import type { Decision } from '../types';

export interface DayBar {
  label: string;
  count: number;
  isToday: boolean;
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface WeeklyAnalysis {
  thisWeekCount: number;
  lastWeekCount: number;
  activeDays: number;
  dailyBars: DayBar[];
  categoryStats: CategoryStat[];
  topMood: string | null;
  trend: 'up' | 'down' | 'same';
  trendPercent: number;
}

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function getWeekStart(offsetWeeks = 0): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Pazartesi = hafta başı
  const start = new Date(now);
  start.setDate(now.getDate() + diff - offsetWeeks * 7);
  start.setHours(0, 0, 0, 0);
  return start;
}

function dayIndex(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1; // 0=Pzt, 6=Paz
}

export function useWeeklyAnalysis(decisions: Decision[]): WeeklyAnalysis {
  const thisWeekStart = getWeekStart(0);
  const lastWeekStart = getWeekStart(1);

  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 7);

  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 7);

  const thisWeek = decisions.filter((d) => {
    const date = new Date(d.createdAt);
    return date >= thisWeekStart && date < thisWeekEnd;
  });

  const lastWeek = decisions.filter((d) => {
    const date = new Date(d.createdAt);
    return date >= lastWeekStart && date < lastWeekEnd;
  });

  // Günlük dağılım
  const dailyCounts = new Array(7).fill(0);
  thisWeek.forEach((d) => {
    dailyCounts[dayIndex(new Date(d.createdAt))]++;
  });

  const todayIndex = dayIndex(new Date());
  const dailyBars: DayBar[] = DAY_LABELS.map((label, i) => ({
    label,
    count: dailyCounts[i],
    isToday: i === todayIndex,
  }));

  // Kategori dağılımı
  const catCounts: Record<string, number> = {};
  thisWeek.forEach((d) => {
    const cat = d.selectedActivity.category;
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });

  const total = thisWeek.length;
  const categoryStats: CategoryStat[] = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

  // En sık mod
  const moodCounts: Record<string, number> = {};
  thisWeek.forEach((d) => {
    const mood = (d.inputJson as any)?.mood;
    if (mood) moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Geçen haftayla karşılaştırma
  const thisCount = thisWeek.length;
  const lastCount = lastWeek.length;
  let trend: 'up' | 'down' | 'same' = 'same';
  let trendPercent = 0;

  if (lastCount === 0 && thisCount > 0) {
    trend = 'up';
    trendPercent = 100;
  } else if (lastCount > 0) {
    const diff = thisCount - lastCount;
    trendPercent = Math.abs(Math.round((diff / lastCount) * 100));
    trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'same';
  }

  return {
    thisWeekCount: thisCount,
    lastWeekCount: lastCount,
    activeDays: dailyCounts.filter((c) => c > 0).length,
    dailyBars,
    categoryStats,
    topMood,
    trend,
    trendPercent,
  };
}
