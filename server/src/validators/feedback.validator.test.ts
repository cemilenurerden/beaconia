import { describe, it, expect } from 'vitest';
import { feedbackSchema } from './feedback.validator.js';

describe('feedbackSchema', () => {
  const validInput = {
    decisionId: '550e8400-e29b-41d4-a716-446655440000',
    feedback: 'up',
  };

  it('should accept valid feedback with "up"', () => {
    const result = feedbackSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should accept valid feedback with "down"', () => {
    const result = feedbackSchema.safeParse({ ...validInput, feedback: 'down' });
    expect(result.success).toBe(true);
  });

  it('should accept valid feedback with "retry"', () => {
    const result = feedbackSchema.safeParse({ ...validInput, feedback: 'retry' });
    expect(result.success).toBe(true);
  });

  it('should accept optional reason', () => {
    const result = feedbackSchema.safeParse({ ...validInput, reason: 'Too hard' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid decisionId (not UUID)', () => {
    const result = feedbackSchema.safeParse({ ...validInput, decisionId: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('should reject missing decisionId', () => {
    const result = feedbackSchema.safeParse({ feedback: 'up' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid feedback value', () => {
    const result = feedbackSchema.safeParse({ ...validInput, feedback: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should reject missing feedback', () => {
    const result = feedbackSchema.safeParse({ decisionId: validInput.decisionId });
    expect(result.success).toBe(false);
  });

  it('should reject empty body', () => {
    const result = feedbackSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
