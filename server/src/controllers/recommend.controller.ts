import { Response, NextFunction } from 'express';
import * as recommendService from '../services/recommend.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';
import { RecommendInput } from '../validators/recommend.validator.js';

export async function recommend(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as RecommendInput;
    const userId = req.user?.id;

    // Limit kontrolleri
    let refreshRemaining: number | undefined;
    if (userId) {
      if (input.isRetry) {
        // Retry → günde 3 yenileme hakkı
        const refreshCheck = await recommendService.checkAndIncrementRefresh(userId);
        if (!refreshCheck.allowed) {
          sendError(res, 'REFRESH_LIMIT', 'Günlük ücretsiz yenileme hakkın doldu. Premium\'a geç!', 403);
          return;
        }
        refreshRemaining = refreshCheck.remaining;
      } else {
        // İlk öneri → günde 1 öneri hakkı
        const recommendCheck = await recommendService.checkAndIncrementRecommend(userId);
        if (!recommendCheck.allowed) {
          sendError(res, 'RECOMMEND_LIMIT', 'Günlük ücretsiz öneri hakkın doldu. Premium\'a geç!', 403);
          return;
        }
      }
    }

    const result = await recommendService.recommend(input, userId);

    if (!result) {
      sendError(res, 'NOT_FOUND', 'No matching activities found for your criteria', 404);
      return;
    }

    sendSuccess(res, { ...result, refreshRemaining });
  } catch (error) {
    next(error);
  }
}
