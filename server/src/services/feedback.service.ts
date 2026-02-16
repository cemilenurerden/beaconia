import { prisma } from '../utils/prisma.js';
import { ApiError } from '../types/index.js';
import { FeedbackInput } from '../validators/feedback.validator.js';

export async function submit(userId: string, input: FeedbackInput) {
  // Find the decision
  const decision = await prisma.decisionHistory.findUnique({
    where: { id: input.decisionId },
  });

  if (!decision) {
    throw new ApiError(404, 'NOT_FOUND', 'Decision not found');
  }

  // Verify ownership
  if (decision.userId !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'You can only provide feedback for your own decisions');
  }

  // Plan B seçildiyse: selectedActivity ile planBActivity yer değiştirsin
  if (input.feedback === 'plan_b' && decision.planBActivityId) {
    await prisma.decisionHistory.update({
      where: { id: input.decisionId },
      data: {
        feedback: input.feedback,
        feedbackReason: input.reason || null,
        selectedActivityId: decision.planBActivityId,
        planBActivityId: decision.selectedActivityId,
      },
    });
  } else {
    await prisma.decisionHistory.update({
      where: { id: input.decisionId },
      data: {
        feedback: input.feedback,
        feedbackReason: input.reason || null,
      },
    });
  }

  return { ok: true };
}
