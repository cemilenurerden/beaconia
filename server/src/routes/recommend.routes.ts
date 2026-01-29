import { Router, RequestHandler } from 'express';
import * as recommendController from '../controllers/recommend.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { optionalAuthMiddleware } from '../middlewares/auth.middleware.js';
import { recommendSchema } from '../validators/recommend.validator.js';

const router = Router();

/**
 * @swagger
 * /recommend:
 *   post:
 *     tags: [Recommend]
 *     summary: Get activity recommendation based on preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [duration, energy, location, cost, social]
 *             properties:
 *               duration:
 *                 type: integer
 *                 minimum: 5
 *                 maximum: 480
 *               energy:
 *                 type: string
 *                 enum: [low, medium, high]
 *               location:
 *                 type: string
 *                 enum: [home, outdoor, any]
 *               cost:
 *                 type: string
 *                 enum: [free, low, medium]
 *               social:
 *                 type: string
 *                 enum: [solo, friends, both]
 *               mood:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity recommendation
 *       404:
 *         description: No matching activities found
 */
router.post(
  '/',
  optionalAuthMiddleware as unknown as RequestHandler,
  validateBody(recommendSchema),
  recommendController.recommend as unknown as RequestHandler
);

export default router;
