import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDecision, mockUser, mockUser2 } from '../__tests__/helpers/fixtures.js';

vi.mock('../utils/prisma.js', () => ({
  prisma: {
    decisionHistory: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from '../utils/prisma.js';
import { submit } from './feedback.service.js';

const mockFindUnique = prisma.decisionHistory.findUnique as ReturnType<typeof vi.fn>;
const mockUpdate = prisma.decisionHistory.update as ReturnType<typeof vi.fn>;

describe('feedback.service - submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit feedback successfully', async () => {
    mockFindUnique.mockResolvedValue(mockDecision);
    mockUpdate.mockResolvedValue({});

    const result = await submit(mockUser.id, {
      decisionId: mockDecision.id,
      feedback: 'up',
    });
    expect(result).toEqual({ ok: true });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: mockDecision.id },
      data: { feedback: 'up', feedbackReason: null },
    });
  });

  it('should submit feedback with reason', async () => {
    mockFindUnique.mockResolvedValue(mockDecision);
    mockUpdate.mockResolvedValue({});

    await submit(mockUser.id, {
      decisionId: mockDecision.id,
      feedback: 'down',
      reason: 'Too difficult',
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: mockDecision.id },
      data: { feedback: 'down', feedbackReason: 'Too difficult' },
    });
  });

  it('should throw 404 when decision not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(
      submit(mockUser.id, { decisionId: 'non-existent', feedback: 'up' })
    ).rejects.toThrow('Decision not found');
  });

  it('should throw 403 when decision belongs to another user', async () => {
    mockFindUnique.mockResolvedValue(mockDecision);

    await expect(
      submit(mockUser2.id, { decisionId: mockDecision.id, feedback: 'up' })
    ).rejects.toThrow('You can only provide feedback for your own decisions');
  });

  it('should set feedbackReason to null when no reason provided', async () => {
    mockFindUnique.mockResolvedValue(mockDecision);
    mockUpdate.mockResolvedValue({});

    await submit(mockUser.id, {
      decisionId: mockDecision.id,
      feedback: 'retry',
    });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ feedbackReason: null }),
      })
    );
  });
});
