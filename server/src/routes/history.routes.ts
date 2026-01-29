import { Router, RequestHandler } from 'express';
import * as historyController from '../controllers/history.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware as unknown as RequestHandler);

/**
 * @swagger
 * /history:
 *   get:
 *     tags: [History]
 *     summary: Get decision history for current user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Decision history list
 *       401:
 *         description: Unauthorized
 */
router.get('/', historyController.findAll as unknown as RequestHandler);

export default router;
