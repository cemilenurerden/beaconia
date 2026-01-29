import { Request, Response, NextFunction } from 'express';
import * as activitiesService from '../services/activities.service.js';
import { sendSuccess } from '../utils/response.js';
import { FilterActivitiesInput } from '../validators/activities.validator.js';

export async function findAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filter = req.query as unknown as FilterActivitiesInput;
    const result = await activitiesService.findAll(filter);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
