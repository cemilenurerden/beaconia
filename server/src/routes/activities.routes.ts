import { Router } from 'express';
import * as activitiesController from '../controllers/activities.controller.js';
import { validateQuery } from '../middlewares/validate.middleware.js';
import { filterActivitiesSchema } from '../validators/activities.validator.js';

const router = Router();

/**
 * @swagger
 * /activities:
 *   get:
 *     tags: [Activities]
 *     summary: Get activities with filters and pagination
 *     parameters:
 *       - in: query
 *         name: duration
 *         schema:
 *           type: integer
 *         description: Available duration in minutes
 *       - in: query
 *         name: energy
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           enum: [home, outdoor, any]
 *       - in: query
 *         name: cost
 *         schema:
 *           type: string
 *           enum: [free, low, medium]
 *       - in: query
 *         name: social
 *         schema:
 *           type: string
 *           enum: [solo, friends, both]
 *       - in: query
 *         name: mood
 *         schema:
 *           type: string
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
 *         description: List of activities
 */
router.get('/', validateQuery(filterActivitiesSchema), activitiesController.findAll);

export default router;
