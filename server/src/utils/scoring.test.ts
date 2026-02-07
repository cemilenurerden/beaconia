import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scoreActivity, generateReason, generateFirstStep, RecommendInput } from './scoring.js';
import { mockActivity, mockActivity2, mockActivity3 } from '../__tests__/helpers/fixtures.js';

// Base input for tests
const baseInput: RecommendInput = {
  duration: 30,
  energy: 'low',
  location: 'home',
  cost: 'free',
  social: 'solo',
};

describe('scoreActivity', () => {
  let randomSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Fix random jitter to 0 for deterministic tests
    randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('should return base score of 100 when all match perfectly and no duration diff', () => {
    const score = scoreActivity(mockActivity, baseInput);
    // mockActivity: durationMid = 30, energy=low, location=home, cost=free, social=solo
    // +20 energy + 15 location + 15 cost + 15 social + 0 jitter (0.5-0.5)*10 = 0
    // duration diff = 0 -> -0
    expect(score).toBe(165);
  });

  it('should penalize duration difference by 0.5 per minute', () => {
    const input: RecommendInput = { ...baseInput, duration: 60 };
    const score = scoreActivity(mockActivity, input);
    // durationMid = 30, diff = 30, penalty = 15
    // 100 - 15 + 20 + 15 + 15 + 15 + 0 = 150
    expect(score).toBe(150);
  });

  it('should add +20 bonus for matching energy level', () => {
    const matchScore = scoreActivity(mockActivity, { ...baseInput, energy: 'low' });
    const noMatchScore = scoreActivity(mockActivity, { ...baseInput, energy: 'high' });
    expect(matchScore - noMatchScore).toBe(20);
  });

  it('should add +15 bonus for exact location match', () => {
    const matchScore = scoreActivity(mockActivity, { ...baseInput, location: 'home' });
    const noMatchScore = scoreActivity(mockActivity, { ...baseInput, location: 'outdoor' });
    // home matches home = +15, outdoor != home and home != 'any' = 0
    expect(matchScore - noMatchScore).toBe(15);
  });

  it('should add +5 bonus when activity location is "any"', () => {
    const anyActivity = { ...mockActivity, location: 'any' as const };
    const score = scoreActivity(anyActivity, { ...baseInput, location: 'outdoor' });
    // location: 'any' != 'outdoor' -> not exact match, but location is 'any' -> +5
    // 100 - 0 + 20 + 5 + 15 + 15 = 155
    expect(score).toBe(155);
  });

  it('should add +15 bonus for matching cost', () => {
    const matchScore = scoreActivity(mockActivity, { ...baseInput, cost: 'free' });
    const noMatchScore = scoreActivity(mockActivity, { ...baseInput, cost: 'medium' });
    expect(matchScore - noMatchScore).toBe(15);
  });

  it('should add +15 bonus for matching social', () => {
    const matchScore = scoreActivity(mockActivity, { ...baseInput, social: 'solo' });
    const noMatchScore = scoreActivity(mockActivity, { ...baseInput, social: 'friends' });
    expect(matchScore - noMatchScore).toBe(15);
  });

  it('should add +5 bonus when activity social is "both"', () => {
    // mockActivity3 has social: 'both'
    const score = scoreActivity(mockActivity3, { ...baseInput, social: 'solo' });
    // social: 'both' != 'solo' exact, but 'both' => +5
    expect(score).toBeGreaterThan(
      scoreActivity({ ...mockActivity3, social: 'friends' as const }, { ...baseInput, social: 'solo' })
    );
  });

  it('should add +30 bonus for mood match', () => {
    const input: RecommendInput = { ...baseInput, mood: 'stressed' };
    const score = scoreActivity(mockActivity, input);
    // mockActivity has moodTags: ['stressed', 'anxious', 'tired']
    const noMoodScore = scoreActivity(mockActivity, baseInput);
    expect(score - noMoodScore).toBe(30);
  });

  it('should not add mood bonus when mood does not match', () => {
    const input: RecommendInput = { ...baseInput, mood: 'happy' };
    const noMoodInput: RecommendInput = { ...baseInput };
    const moodScore = scoreActivity(mockActivity, input);
    const noMoodScore = scoreActivity(mockActivity, noMoodInput);
    // 'happy' is not in mockActivity.moodTags -> no bonus
    expect(moodScore).toBe(noMoodScore);
  });

  it('should not add mood bonus when mood is undefined', () => {
    const input: RecommendInput = { ...baseInput };
    delete input.mood;
    const score = scoreActivity(mockActivity, input);
    expect(score).toBe(165);
  });

  it('should include random jitter', () => {
    randomSpy.mockReturnValue(0.0); // jitter = (0 - 0.5) * 10 = -5
    const lowScore = scoreActivity(mockActivity, baseInput);

    randomSpy.mockReturnValue(1.0); // jitter = (1 - 0.5) * 10 = +5
    const highScore = scoreActivity(mockActivity, baseInput);

    expect(highScore - lowScore).toBe(10);
  });
});

describe('generateReason', () => {
  it('should include energy text when energy matches', () => {
    const reason = generateReason(mockActivity, { ...baseInput, energy: 'low' });
    expect(reason).toContain('düşük enerji seviyenize uygun');
  });

  it('should include medium energy text', () => {
    const activity = { ...mockActivity, energyLevel: 'medium' as const };
    const reason = generateReason(activity, { ...baseInput, energy: 'medium' });
    expect(reason).toContain('orta enerji seviyenize uygun');
  });

  it('should include high energy text', () => {
    const activity = { ...mockActivity, energyLevel: 'high' as const };
    const reason = generateReason(activity, { ...baseInput, energy: 'high' });
    expect(reason).toContain('yüksek enerji seviyenize uygun');
  });

  it('should include location text when location matches', () => {
    const reason = generateReason(mockActivity, { ...baseInput, location: 'home' });
    expect(reason).toContain('evde yapılabilir');
  });

  it('should include "her yerde" for any location', () => {
    const activity = { ...mockActivity, location: 'any' as const };
    const reason = generateReason(activity, { ...baseInput, location: 'outdoor' });
    expect(reason).toContain('her yerde yapılabilir');
  });

  it('should include mood text for known moods when within first 2 reasons', () => {
    // Use an activity that doesn't match energy or location so mood is in top 2
    const activity = { ...mockActivity, energyLevel: 'high' as const, location: 'outdoor' as const };
    const reason = generateReason(activity, { ...baseInput, mood: 'stressed', energy: 'low', location: 'home' });
    // No energy or location match, so reasons array has: mood + duration -> mood should be in top 2
    expect(reason).toContain('stres atmanıza yardımcı olabilir');
  });

  it('should include fallback mood text for unknown moods', () => {
    // Use activity with no energy/location match so custom mood text appears in top 2
    const activity = { ...mockActivity, energyLevel: 'high' as const, location: 'outdoor' as const, moodTags: ['custom-mood'] };
    const reason = generateReason(activity, { ...baseInput, mood: 'custom-mood', energy: 'low', location: 'home' });
    expect(reason).toContain('"custom-mood" modunuza uygun');
  });

  it('should always include duration text in reasons array', () => {
    // Use activity with no energy/location/mood match so duration is in the first 2
    const activity = { ...mockActivity, energyLevel: 'high' as const, location: 'outdoor' as const };
    const reason = generateReason(activity, { ...baseInput, energy: 'low', location: 'home' });
    // Only reason is duration, so it should appear
    expect(reason).toContain('yaklaşık 30 dakika sürer');
  });
});

describe('generateFirstStep', () => {
  it('should return first step from activity steps array', () => {
    const step = generateFirstStep(mockActivity);
    expect(step).toBe('Yoga matını ser');
  });

  it('should return fallback for fitness category when no steps', () => {
    const activity = { ...mockActivity2, steps: [], category: 'fitness' };
    const step = generateFirstStep(activity);
    expect(step).toBe('Spor kıyafetlerini giy ve hazırlan.');
  });

  it('should return fallback for wellness category', () => {
    const activity = { ...mockActivity, steps: [], category: 'wellness' };
    const step = generateFirstStep(activity);
    expect(step).toBe('Rahat bir pozisyon bul ve başla.');
  });

  it('should return fallback for cooking category', () => {
    const activity = { ...mockActivity, steps: [], category: 'cooking' };
    const step = generateFirstStep(activity);
    expect(step).toBe('Mutfağa geç ve malzemeleri hazırla.');
  });

  it('should return generic fallback for unknown category', () => {
    const activity = { ...mockActivity, steps: [], category: 'unknown' };
    const step = generateFirstStep(activity);
    expect(step).toBe('Hadi başla!');
  });

  it('should return first step even when steps is null-ish via JSON', () => {
    const activity = { ...mockActivity, steps: null as any };
    const step = generateFirstStep(activity);
    expect(step).toBeDefined();
  });
});
