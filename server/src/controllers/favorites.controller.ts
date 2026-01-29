import { Response, NextFunction } from 'express';
import * as favoritesService from '../services/favorites.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export async function findAll(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id as string;
    const result = await favoritesService.findAll(userId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function add(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id as string;
    const activityId = req.params.activityId as string;
    const result = await favoritesService.add(userId, activityId);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id as string;
    const activityId = req.params.activityId as string;
    const result = await favoritesService.remove(userId, activityId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}


