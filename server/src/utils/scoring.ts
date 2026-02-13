import { Activity, EnergyLevel, Location, Cost, Social } from '@prisma/client';

export interface RecommendInput {
  duration: number;
  energy: EnergyLevel;
  location: Location;
  cost: Cost;
  social: Social;
  mood?: string;
}

export const TURKISH_LABELS = {
  energy: { low: 'düşük', medium: 'orta', high: 'yüksek' } as Record<string, string>,
  location: { home: 'evde', outdoor: 'dışarıda', any: 'fark etmez' } as Record<string, string>,
  cost: { free: 'bedava', low: 'ekonomik', medium: 'orta bütçe' } as Record<string, string>,
  social: { solo: 'yalnız', friends: 'arkadaşlarla', both: 'fark etmez' } as Record<string, string>,
  mood: {
    happy: 'mutlu', motivated: 'motive', excited: 'heyecanlı', sad: 'üzgün',
    stressed: 'stresli', bored: 'sıkılmış', anxious: 'kaygılı', tired: 'yorgun',
    creative: 'yaratıcı', energetic: 'enerjik',
  } as Record<string, string>,
};

/**
 * Score an activity based on how well it matches the user's preferences
 * Higher score = better match
 */
export function scoreActivity(activity: Activity, input: RecommendInput): number {
  let score = 100; // Base score

  // Duration match bonus (closer to requested duration = higher score)
  const durationMid = (activity.durationMin + activity.durationMax) / 2;
  const durationDiff = Math.abs(durationMid - input.duration);
  score -= durationDiff * 0.5; // Slight penalty for duration difference

  // Energy level exact match bonus
  if (activity.energyLevel === input.energy) {
    score += 20;
  }

  // Location exact match bonus (not just 'any')
  if (activity.location === input.location) {
    score += 15;
  } else if (activity.location === 'any') {
    score += 5; // Small bonus for flexible location
  }

  // Cost exact match bonus
  if (activity.cost === input.cost) {
    score += 15;
  }

  // Social exact match bonus
  if (activity.social === input.social) {
    score += 15;
  } else if (activity.social === 'both') {
    score += 5; // Small bonus for flexible social
  }

  // Mood match bonus (big bonus if mood matches)
  if (input.mood && activity.moodTags.includes(input.mood)) {
    score += 30;
  }

  // Add random jitter for variety (±5 points)
  const jitter = (Math.random() - 0.5) * 10;
  score += jitter;

  return score;
}

/**
 * Generate a reason for why this activity was selected
 */
export function generateReason(activity: Activity, input: RecommendInput): string {
  const reasons: string[] = [];

  // Energy match
  if (activity.energyLevel === input.energy) {
    const energyTexts: Record<string, string> = {
      low: 'düşük enerji seviyenize uygun',
      medium: 'orta enerji seviyenize uygun',
      high: 'yüksek enerji seviyenize uygun',
    };
    reasons.push(energyTexts[activity.energyLevel]);
  }

  // Location match
  if (activity.location === input.location || activity.location === 'any') {
    const locationTexts: Record<string, string> = {
      home: 'evde yapılabilir',
      outdoor: 'dışarıda yapılabilir',
      any: 'her yerde yapılabilir',
    };
    reasons.push(locationTexts[activity.location]);
  }

  // Mood match
  if (input.mood && activity.moodTags.includes(input.mood)) {
    const moodTexts: Record<string, string> = {
      stressed: 'stres atmanıza yardımcı olabilir',
      bored: 'sıkıntınızı giderebilir',
      anxious: 'kaygınızı azaltabilir',
      tired: 'yorgunluğunuza iyi gelebilir',
      happy: 'mutluluğunuzu artırabilir',
      creative: 'yaratıcılığınızı tetikleyebilir',
      social: 'sosyalleşme ihtiyacınıza uygun',
      energetic: 'enerjinizi kanalize edebilir',
    };
    reasons.push(moodTexts[input.mood] || `"${input.mood}" modunuza uygun`);
  }

  // Duration match
  const durationMid = (activity.durationMin + activity.durationMax) / 2;
  reasons.push(`yaklaşık ${Math.round(durationMid)} dakika sürer`);

  if (reasons.length === 0) {
    return `${activity.title} şu an için harika bir seçim olabilir!`;
  }

  return `Bu aktivite ${reasons.slice(0, 2).join(' ve ')}.`;
}

/**
 * Generate the first step to get started with the activity
 */
export function generateFirstStep(activity: Activity): string {
  const steps = activity.steps as string[];
  
  if (steps && steps.length > 0) {
    return steps[0];
  }

  // Fallback first steps based on category
  const categoryFirstSteps: Record<string, string> = {
    fitness: 'Spor kıyafetlerini giy ve hazırlan.',
    wellness: 'Rahat bir pozisyon bul ve başla.',
    entertainment: 'Kendine rahat bir köşe ayır.',
    education: 'Not defterini hazırla.',
    social: 'Arkadaşlarını ara veya mesaj at.',
    cooking: 'Mutfağa geç ve malzemeleri hazırla.',
    outdoor: 'Rahat ayakkabılarını giy.',
    art: 'Malzemelerini hazırla.',
    music: 'Enstrümanını al.',
  };

  return categoryFirstSteps[activity.category] || 'Hadi başla!';
}
