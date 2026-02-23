import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getSelfAnalysis } from '../api/user';
import type { Insight } from '../types';

export type { Insight };

export function useKendiniTani() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading((prev) => (insights.length === 0 ? true : prev));
      getSelfAnalysis()
        .then(setInsights)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [])
  );

  return { insights, loading };
}
