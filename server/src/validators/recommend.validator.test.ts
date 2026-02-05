import { describe, it, expect } from 'vitest';
import { recommendSchema } from './recommend.validator.js';

describe('recommendSchema', () => {
  const validInput = {
    duration: 30,
    energy: 'low',
    location: 'home',
    cost: 'free',
    social: 'solo',
  };

  it('should accept valid input', () => {
    const result = recommendSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should accept input with optional mood', () => {
    const result = recommendSchema.safeParse({ ...validInput, mood: 'stressed' });
    expect(result.success).toBe(true);
  });

  it('should reject missing duration', () => {
    const { duration, ...rest } = validInput;
    const result = recommendSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should reject duration less than 5', () => {
    const result = recommendSchema.safeParse({ ...validInput, duration: 4 });
    expect(result.success).toBe(false);
  });

  it('should reject duration greater than 480', () => {
    const result = recommendSchema.safeParse({ ...validInput, duration: 481 });
    expect(result.success).toBe(false);
  });

  it('should reject missing energy', () => {
    const { energy, ...rest } = validInput;
    const result = recommendSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should reject invalid energy value', () => {
    const result = recommendSchema.safeParse({ ...validInput, energy: 'extreme' });
    expect(result.success).toBe(false);
  });

  it('should reject missing location', () => {
    const { location, ...rest } = validInput;
    const result = recommendSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should reject missing cost', () => {
    const { cost, ...rest } = validInput;
    const result = recommendSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should reject missing social', () => {
    const { social, ...rest } = validInput;
    const result = recommendSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should accept boundary duration value 5', () => {
    const result = recommendSchema.safeParse({ ...validInput, duration: 5 });
    expect(result.success).toBe(true);
  });

  it('should accept boundary duration value 480', () => {
    const result = recommendSchema.safeParse({ ...validInput, duration: 480 });
    expect(result.success).toBe(true);
  });
});
