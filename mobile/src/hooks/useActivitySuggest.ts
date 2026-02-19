import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { getPreferences, updatePreferences } from '../api/user';
import { getRecommendation } from '../api/recommend';
import { addFavorite } from '../api/favorites';
import { submitFeedback } from '../api/feedback';
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
  const [goal, setGoal] = useState<string>('');

  const [phase, setPhase] = useState<Phase>('form');
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

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
      if (form.goal) setGoal(form.goal);
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
      const input = formToApiInput({ duration, energy, isHome, budget, isAlone, mood, goal });
      const currentExcludes = retry && result ? [...excludeIds, result.selected.id] : [];

      if (retry && result) {
        setExcludeIds(currentExcludes);
      } else {
        setExcludeIds([]);
      }

      const [rec] = await Promise.all([
        getRecommendation({
          ...input,
          excludeIds: currentExcludes.length > 0 ? currentExcludes : undefined,
          isRetry: retry || undefined,
        }),
        updatePreferences(input),
      ]);

      setResult(rec);
      if (retry) {
        setRefreshCount((c) => c + 1);
      } else {
        setRefreshCount(0);
      }
      setPhase('result');
    } catch (error: any) {
      // Backend'den limit hatası gelirse premium sayfasına yönlendir
      if (error.code === 'REFRESH_LIMIT' || error.code === 'RECOMMEND_LIMIT') {
        setPhase('result');
        router.push('/premium');
        return;
      }
      Alert.alert('Hata', error.message || 'Öneri alınamadı. Lütfen tekrar dene.');
      setPhase('form');
    }
  }

  async function handleSelectPlanB(reason?: string) {
    if (!result?.decisionId) return;
    try {
      await submitFeedback({ decisionId: result.decisionId, feedback: 'plan_b', reason });
    } catch {}
    Alert.alert('Plan B Seçildi', `${result.planB?.title} ile devam ediyorsun!`);
    setPhase('form');
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
    goal, setGoal,
    // Phase & result
    phase, result, refreshCount,
    // Actions
    handleRecommend, handleFavorite, handleSelectPlanB, resetToForm,
  };
}
