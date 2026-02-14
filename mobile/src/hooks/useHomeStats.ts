import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getStats } from '../api/user';
import type { UserStats } from '../types';

const DEFAULT_STATS: UserStats = {
  dailyCompleted: 0,
  dailyGoal: 3,
  streak: 0,
};

export function useHomeStats() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);

  useFocusEffect(
    useCallback(() => {
      getStats().then(setStats).catch(() => {});
    }, [])
  );

  return stats;
}
