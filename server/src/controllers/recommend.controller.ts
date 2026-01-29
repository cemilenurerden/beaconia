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
    
    const result = await recommendService.recommend(input, userId);
    
    if (!result) {
      sendError(res, 'NOT_FOUND', 'No matching activities found for your criteria', 404);
      return;
    }
    
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
