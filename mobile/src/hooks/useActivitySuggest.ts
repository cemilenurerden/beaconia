import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getPreferences, updatePreferences } from '../api/user';
import { getRecommendation } from '../api/recommend';
import { addFavorite } from '../api/favorites';
import { formToApiInput, preferencesToForm } from '../utils/mappers';
import type { Phase } from '../constants/activity-suggest';
import type { RecommendResult } from '../types';

export function useActivitySuggest() {
  const [duration, setDuration] = useState(45);
  const [energy, setEnergy] = useState<string>('Orta');
  const [isHome, setIsHome] = useState(true);
  const [budget, setBudget] = useState<string>('EKONOMİK');
  const [isAlone, setIsAlone] = useState(false);
  const [mood, setMood] = useState<string>('🔥');

  const [phase, setPhase] = useState<Phase>('form');
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);

  // Sayfa açılışında önceki tercihleri yükle
  useEffect(() => {
    getPreferences().then((prefs) => {
      if (!prefs) return;
      const form = preferencesToForm(prefs);
      setDuration(form.duration);
      setEnergy(form.energy);
      setIsHome(form.isHome);
      setBudget(form.budget);
      setIsAlone(form.isAlone);
      setMood(form.mood);
    }).catch(() => {});
  }, []);

  async function handleFavorite() {
    if (!result) return;
    try {
      await addFavorite(result.selected.id);
      Alert.alert('Favorilere Eklendi', `${result.selected.title} favorilerine eklendi!`);
      setPhase('form');
    } catch {
      Alert.alert('Bilgi', 'Bu aktivite zaten favorilerinde.');
    }
  }

  async function handleRecommend(retry = false) {
    setPhase('loading');
    try {
      const input = formToApiInput({ duration, energy, isHome, budget, isAlone, mood });
      const currentExcludes = retry && result ? [...excludeIds, result.selected.id] : [];

      if (retry && result) {
        setExcludeIds(currentExcludes);
      } else {
        setExcludeIds([]);
      }

      const [rec] = await Promise.all([
        getRecommendation({ ...input, excludeIds: currentExcludes.length > 0 ? currentExcludes : undefined }),
        updatePreferences(input),
      ]);

      setResult(rec);
      setPhase('result');
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Öneri alınamadı. Lütfen tekrar dene.');
      setPhase('form');
    }
  }

  function resetToForm() {
    setPhase('form');
    setExcludeIds([]);
  }

  return {
    // Form state
    duration, setDuration,
    energy, setEnergy,
    isHome, setIsHome,
    budget, setBudget,
    isAlone, setIsAlone,
    mood, setMood,
    // Phase & result
    phase, result,
    // Actions
    handleRecommend, handleFavorite, resetToForm,
  };
}
