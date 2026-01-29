import { Response, NextFunction } from 'express';
import * as historyService from '../services/history.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export async function findAll(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const result = await historyService.findAll(userId, page, limit);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
