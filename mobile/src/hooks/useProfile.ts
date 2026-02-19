import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getProfileAnalysis } from '../api/user';
import type { ProfileAnalysis } from '../types';

const DEFAULT: ProfileAnalysis = {
  totalActivities: 0,
  longestStreak: 0,
  favoriteActivity: '',
  weeklyHours: 0,
  categoryDistribution: [],
  topEnergy: 'Orta',
  topLocation: 'Farketmez',
  topSocial: 'Karışık',
  topMoods: [],
};

export function useProfile() {
  const [analysis, setAnalysis] = useState<ProfileAnalysis>(DEFAULT);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getProfileAnalysis()
        .then(setAnalysis)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [])
  );

  return { analysis, loading };
}
