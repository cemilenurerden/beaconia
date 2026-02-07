import { describe, it, expect } from 'vitest';
import { filterActivitiesSchema } from './activities.validator.js';

describe('filterActivitiesSchema', () => {
  it('should accept empty query (all optional, defaults applied)', () => {
    const result = filterActivitiesSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it('should accept all valid filters', () => {
    const result = filterActivitiesSchema.safeParse({
      duration: '60',
      energy: 'medium',
      location: 'home',
      cost: 'free',
      social: 'solo',
      mood: 'stressed',
      page: '2',
      limit: '10',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.duration).toBe(60);
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(10);
    }
  });

  it('should reject duration less than 1', () => {
    const result = filterActivitiesSchema.safeParse({ duration: '0' });
    expect(result.success).toBe(false);
  });

  it('should reject duration greater than 480', () => {
    const result = filterActivitiesSchema.safeParse({ duration: '481' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid energy value', () => {
    const result = filterActivitiesSchema.safeParse({ energy: 'extreme' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid location value', () => {
    const result = filterActivitiesSchema.safeParse({ location: 'office' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid cost value', () => {
    const result = filterActivitiesSchema.safeParse({ cost: 'expensive' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid social value', () => {
    const result = filterActivitiesSchema.safeParse({ social: 'party' });
    expect(result.success).toBe(false);
  });

  it('should reject limit greater than 100', () => {
    const result = filterActivitiesSchema.safeParse({ limit: '101' });
    expect(result.success).toBe(false);
  });

  it('should coerce string numbers to integers', () => {
    const result = filterActivitiesSchema.safeParse({ duration: '30', page: '1', limit: '10' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.duration).toBe(30);
      expect(typeof result.data.duration).toBe('number');
    }
  });
});
