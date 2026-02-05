import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockActivity, mockActivity2, mockUser } from '../__tests__/helpers/fixtures.js';

vi.mock('../utils/prisma.js', () => ({
  prisma: {
    activity: {
      findMany: vi.fn(),
    },
    decisionHistory: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../utils/scoring.js', () => ({
  scoreActivity: vi.fn(),
  generateReason: vi.fn().mockReturnValue('Mock reason'),
  generateFirstStep: vi.fn().mockReturnValue('Mock first step'),
}));

import { prisma } from '../utils/prisma.js';
import { scoreActivity } from '../utils/scoring.js';
import { recommend } from './recommend.service.js';

const mockFindMany = prisma.activity.findMany as ReturnType<typeof vi.fn>;
const mockCreateDecision = prisma.decisionHistory.create as ReturnType<typeof vi.fn>;
const mockScore = scoreActivity as ReturnType<typeof vi.fn>;

const validInput = {
  duration: 30,
  energy: 'low' as const,
  location: 'home' as const,
  cost: 'free' as const,
  social: 'solo' as const,
};

describe('recommend.service - recommend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no candidates found', async () => {
    mockFindMany.mockResolvedValue([]);
    const result = await recommend(validInput);
    expect(result).toBeNull();
  });

  it('should return selected activity with highest score', async () => {
    mockFindMany.mockResolvedValue([mockActivity, mockActivity2]);
    mockScore.mockReturnValueOnce(150).mockReturnValueOnce(120);

    const result = await recommend(validInput);
    expect(result).not.toBeNull();
    expect(result!.selected).toEqual(mockActivity);
    expect(result!.reason).toBe('Mock reason');
    expect(result!.firstStep).toBe('Mock first step');
  });

  it('should return planB as second highest scored activity', async () => {
    mockFindMany.mockResolvedValue([mockActivity, mockActivity2]);
    mockScore.mockReturnValueOnce(150).mockReturnValueOnce(120);

    const result = await recommend(validInput);
    expect(result!.planB).toEqual(mockActivity2);
  });

  it('should return planB as null when only one candidate', async () => {
    mockFindMany.mockResolvedValue([mockActivity]);
    mockScore.mockReturnValueOnce(150);

    const result = await recommend(validInput);
    expect(result!.planB).toBeNull();
  });

  it('should save decision history when userId is provided', async () => {
    mockFindMany.mockResolvedValue([mockActivity]);
    mockScore.mockReturnValueOnce(150);
    mockCreateDecision.mockResolvedValue({ id: 'decision-123' });

    const result = await recommend(validInput, mockUser.id);
    expect(mockCreateDecision).toHaveBeenCalled();
    expect(result!.decisionId).toBe('decision-123');
  });

  it('should not save decision history when userId is not provided', async () => {
    mockFindMany.mockResolvedValue([mockActivity]);
    mockScore.mockReturnValueOnce(150);

    const result = await recommend(validInput);
    expect(mockCreateDecision).not.toHaveBeenCalled();
    expect(result!.decisionId).toBeNull();
  });

  it('should apply duration filter to query', async () => {
    mockFindMany.mockResolvedValue([]);

    await recommend(validInput);
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.durationMin).toEqual({ lte: 30 });
    expect(call.where.durationMax).toEqual({ gte: 30 });
  });
});
