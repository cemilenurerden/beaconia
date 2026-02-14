export const ENERGY_OPTIONS = ['Düşük', 'Orta', 'Yüksek'] as const;

export const BUDGET_OPTIONS = [
  { label: '₺0', sub: 'BEDAVA' },
  { label: '₺', sub: 'EKONOMİK' },
  { label: '₺₺', sub: 'LÜKS' },
] as const;

export const MOOD_OPTIONS = ['😊', '🔥', '🤩', '😢'] as const;

export const LOADING_MESSAGES = [
  'Enerjine uygun aktiviteler taranıyor...',
  'Ruh haline göre eşleştiriliyor...',
  'Sana özel seçenekler hazırlanıyor...',
  'Yapay zeka düşünüyor...',
];

export const CATEGORY_ICONS: Record<string, string> = {
  fitness: '🏃',
  wellness: '🧘',
  entertainment: '🎬',
  education: '📚',
  social: '👥',
  cooking: '🍳',
  outdoor: '🌿',
  art: '🎨',
  music: '🎵',
  hobby: '🧩',
  'self-care': '💆',
  productivity: '🧹',
  culture: '🏛️',
  sports: '⚽',
  adventure: '🧗',
  shopping: '🛍️',
  puzzle: '🧠',
};

export type Phase = 'form' | 'loading' | 'result';
