import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory } from '../api/history';
import { getFavorites, removeFavorite } from '../api/favorites';
import { groupByDate } from '../utils/history';
import type { Decision, Activity, Section } from '../types';

export function useHistory() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([
        getHistory().then((r) => setDecisions(r.decisions ?? [])).catch(() => setDecisions([])),
        getFavorites().then(setFavorites).catch(() => setFavorites([])),
      ]).finally(() => setLoading(false));
    }, [])
  );

  async function handleRemoveFavorite(activityId: string) {
    try {
      await removeFavorite(activityId);
      setFavorites((prev) => prev.filter((a) => a.id !== activityId));
    } catch {
      Alert.alert('Hata', 'Favori kaldırılamadı.');
    }
  }

  const sections: Section[] = groupByDate(decisions);

  return { decisions, favorites, loading, sections, handleRemoveFavorite };
}
