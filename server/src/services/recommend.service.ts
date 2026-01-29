import { Activity, Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';
import { RecommendInput } from '../validators/recommend.validator.js';
import { scoreActivity, generateReason, generateFirstStep } from '../utils/scoring.js';

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
  const where: Prisma.ActivityWhereInput = {
    durationMin: { lte: input.duration },
    durationMax: { gte: input.duration },
  };

  // Energy filter
  if (input.energy) {
    where.energyLevel = input.energy;
  }

  // Location filter - handle 'any' flexibility
  if (input.location && input.location !== 'any') {
    where.OR = [
      { location: input.location },
      { location: 'any' },
    ];
  }

  // Cost filter
  if (input.cost) {
    where.cost = input.cost;
  }

  // Social filter - handle 'both' flexibility
  if (input.social && input.social !== 'both') {
    where.OR = where.OR || [];
    if (Array.isArray(where.OR)) {
      where.OR = [
        { social: input.social },
        { social: 'both' },
      ];
    }
  }

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

  // Select top 1 as selected, top 2 as planB
  const selected = topCandidates[0].activity;
  const planB = topCandidates.length > 1 ? topCandidates[1].activity : null;

  // Generate reason and first step
  const reason = generateReason(selected, scoringInput);
  const firstStep = generateFirstStep(selected);

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
