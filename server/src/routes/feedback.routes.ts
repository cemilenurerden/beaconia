import { Router, RequestHandler } from 'express';
import * as feedbackController from '../controllers/feedback.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { feedbackSchema } from '../validators/feedback.validator.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware as unknown as RequestHandler);

/**
 * @swagger
 * /feedback:
 *   post:
 *     tags: [Feedback]
 *     summary: Submit feedback for a decision
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [decisionId, feedback]
 *             properties:
 *               decisionId:
 *                 type: string
 *                 format: uuid
 *               feedback:
 *                 type: string
 *                 enum: [up, down, retry]
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted
 *       404:
 *         description: Decision not found
 *       403:
 *         description: Not your decision
 */
router.post('/', validateBody(feedbackSchema), feedbackController.submit as unknown as RequestHandler);

export default router;
