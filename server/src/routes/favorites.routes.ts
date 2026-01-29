import { Router, RequestHandler } from 'express';
import * as favoritesController from '../controllers/favorites.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware as unknown as RequestHandler);

/**
 * @swagger
 * /favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get all favorite activities
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite activities
 *       401:
 *         description: Unauthorized
 */
router.get('/', favoritesController.findAll as unknown as RequestHandler);

/**
 * @swagger
 * /favorites/{activityId}:
 *   post:
 *     tags: [Favorites]
 *     summary: Add activity to favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Activity added to favorites
 *       404:
 *         description: Activity not found
 *       409:
 *         description: Already in favorites
 */
router.post('/:activityId', favoritesController.add as unknown as RequestHandler);

/**
 * @swagger
 * /favorites/{activityId}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Remove activity from favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Activity removed from favorites
 *       404:
 *         description: Favorite not found
 */
router.delete('/:activityId', favoritesController.remove as unknown as RequestHandler);

export default router;
