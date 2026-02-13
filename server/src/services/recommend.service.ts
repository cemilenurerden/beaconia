import { Activity, Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';
import { RecommendInput } from '../validators/recommend.validator.js';
import { scoreActivity, generateReason, generateFirstStep } from '../utils/scoring.js';
import { getAiRecommendation } from './ai.service.js';

export interface RecommendResult {
  decisionId: string | null;
  selected: Activity;
  reason: string;
  firstStep: string;
  planB: Activity | null;
}

export async function recommend(
  input: RecommendInput,
  userId?: string
): Promise<RecommendResult | null> {
  // Build filter conditions
  // Sadece süre ve konum ile filtrele, geri kalanı scoring'e bırak
  // Bu sayede her zaman yeterli aday bulunur
  const conditions: Prisma.ActivityWhereInput[] = [
    { durationMin: { lte: input.duration } },
    { durationMax: { gte: input.duration } },
  ];

  // Location filter - handle 'any' flexibility
  if (input.location && input.location !== 'any') {
    conditions.push({
      OR: [{ location: input.location }, { location: 'any' }],
    });
  }

  // Cost filter - inclusive (bütçen yetiyorsa altındakileri de göster)
  const costLevels: Record<string, string[]> = {
    free: ['free'],
    low: ['free', 'low'],
    medium: ['free', 'low', 'medium'],
  };
  if (input.cost) {
    conditions.push({ cost: { in: costLevels[input.cost] as any } });
  }

  const where: Prisma.ActivityWhereInput = { AND: conditions };

  // Fetch candidates
  const candidates = await prisma.activity.findMany({
    where,
    take: 50, // Get more than needed for scoring
  });

  if (candidates.length === 0) {
    return null;
  }

  // Score and sort candidates
  const scoringInput = {
    duration: input.duration,
    energy: input.energy,
    location: input.location,
    cost: input.cost,
    social: input.social,
    mood: input.mood,
  };

  const scoredCandidates = candidates.map((activity) => ({
    activity,
    score: scoreActivity(activity, scoringInput),
  }));

  // Sort by score descending
  scoredCandidates.sort((a, b) => b.score - a.score);

  // Get top candidates (minimum 5 or available)
  const topCandidates = scoredCandidates.slice(0, Math.min(5, scoredCandidates.length));

  // AI ile kişiselleştirilmiş öneri al
  const topActivities = topCandidates.map((c) => c.activity);
  const aiResult = await getAiRecommendation(scoringInput, topActivities);

  let selected: Activity;
  let planB: Activity | null;
  let reason: string;
  let firstStep: string;

  if (aiResult) {
    // AI başarılı - AI'ın seçimini kullan
    selected = topActivities.find((a) => a.id === aiResult.selectedId) || topActivities[0];
    planB = aiResult.planBId
      ? topActivities.find((a) => a.id === aiResult.planBId) || null
      : null;
    reason = aiResult.reason;
    firstStep = aiResult.firstStep;
  } else {
    // AI başarısız - mevcut scoring sistemine fallback
    selected = topCandidates[0].activity;
    planB = topCandidates.length > 1 ? topCandidates[1].activity : null;
    reason = generateReason(selected, scoringInput);
    firstStep = generateFirstStep(selected);
  }

  // Save to history if user is authenticated
  let decisionId: string | null = null;

  if (userId) {
    const decision = await prisma.decisionHistory.create({
      data: {
        userId,
        inputJson: input as unknown as Prisma.JsonObject,
        selectedActivityId: selected.id,
        planBActivityId: planB?.id || null,
        reason,
        firstStep,
      },
    });
    decisionId = decision.id;
  }

  return {
    decisionId,
    selected,
    reason,
    firstStep,
    planB,
  };
}
