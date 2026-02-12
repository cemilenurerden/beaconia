import type { RecommendInput, UserPreferences } from '../types';

// Form → API
const energyToApi: Record<string, string> = {
  'Düşük': 'low',
  'Orta': 'medium',
  'Yüksek': 'high',
};

const budgetToApi: Record<string, string> = {
  'BEDAVA': 'free',
  'EKONOMİK': 'low',
  'LÜKS': 'medium',
};

const moodToApi: Record<string, string> = {
  '😊': 'happy',
  '🔥': 'motivated',
  '🤩': 'excited',
  '😢': 'sad',
};

// API → Form
const energyToForm: Record<string, string> = {
  'low': 'Düşük',
  'medium': 'Orta',
  'high': 'Yüksek',
};

const budgetToForm: Record<string, string> = {
  'free': 'BEDAVA',
  'low': 'EKONOMİK',
  'medium': 'LÜKS',
};

const moodToForm: Record<string, string> = {
  'happy': '😊',
  'motivated': '🔥',
  'excited': '🤩',
  'sad': '😢',
};

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
    energy: (energyToApi[form.energy] || 'medium') as RecommendInput['energy'],
    location: (form.isHome ? 'home' : 'outdoor') as RecommendInput['location'],
    cost: (budgetToApi[form.budget] || 'low') as RecommendInput['cost'],
    social: (form.isAlone ? 'solo' : 'friends') as RecommendInput['social'],
    mood: moodToApi[form.mood] || 'motivated',
  };
}

export function preferencesToForm(prefs: UserPreferences): FormValues {
  return {
    duration: prefs.duration,
    energy: energyToForm[prefs.energy] || 'Orta',
    isHome: prefs.location === 'home',
    budget: budgetToForm[prefs.cost] || 'EKONOMİK',
    isAlone: prefs.social === 'solo',
    mood: moodToForm[prefs.mood || ''] || '🔥',
  };
}
