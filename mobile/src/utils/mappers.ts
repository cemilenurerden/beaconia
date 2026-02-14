import type { RecommendInput, UserPreferences } from '../types';

/** Çift yönlü mapping: { a: '1', b: '2' } → toB['a'] = '1', toA['1'] = 'a' */
function biMap(pairs: [string, string][]): { toApi: Record<string, string>; toForm: Record<string, string> } {
  const toApi: Record<string, string> = {};
  const toForm: Record<string, string> = {};
  for (const [form, api] of pairs) {
    toApi[form] = api;
    toForm[api] = form;
  }
  return { toApi, toForm };
}

const energy = biMap([
  ['Düşük', 'low'],
  ['Orta', 'medium'],
  ['Yüksek', 'high'],
]);

const budget = biMap([
  ['BEDAVA', 'free'],
  ['EKONOMİK', 'low'],
  ['LÜKS', 'medium'],
]);

const mood = biMap([
  ['😊', 'happy'],
  ['🔥', 'motivated'],
  ['🤩', 'excited'],
  ['😢', 'sad'],
]);

export interface FormValues {
  duration: number;
  energy: string;
  isHome: boolean;
  budget: string;
  isAlone: boolean;
  mood: string;
}

export function formToApiInput(form: FormValues): RecommendInput {
  return {
    duration: form.duration,
    energy: (energy.toApi[form.energy] || 'medium') as RecommendInput['energy'],
    location: (form.isHome ? 'home' : 'outdoor') as RecommendInput['location'],
    cost: (budget.toApi[form.budget] || 'low') as RecommendInput['cost'],
    social: (form.isAlone ? 'solo' : 'friends') as RecommendInput['social'],
    mood: mood.toApi[form.mood] || 'motivated',
  };
}

export function preferencesToForm(prefs: UserPreferences): FormValues {
  return {
    duration: prefs.duration,
    energy: energy.toForm[prefs.energy] || 'Orta',
    isHome: prefs.location === 'home',
    budget: budget.toForm[prefs.cost] || 'EKONOMİK',
    isAlone: prefs.social === 'solo',
    mood: mood.toForm[prefs.mood || ''] || '🔥',
  };
}
