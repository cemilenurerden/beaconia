import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

export function check(_req: Request, res: Response): void {
  sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
