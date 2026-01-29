import { Response, NextFunction } from 'express';
import * as feedbackService from '../services/feedback.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';
import { FeedbackInput } from '../validators/feedback.validator.js';

export async function submit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id as string;
    const input = req.body as FeedbackInput;
    const result = await feedbackService.submit(userId, input);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}
