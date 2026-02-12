import { Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export async function getStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const stats = await userService.getStats(userId);
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
}

export async function getPreferences(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const preferences = await userService.getPreferences(userId);
    sendSuccess(res, preferences);
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const preferences = await userService.updatePreferences(userId, req.body);
    sendSuccess(res, preferences);
  } catch (error) {
    next(error);
  }
}
