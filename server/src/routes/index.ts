import { Router } from 'express';
import authRoutes from './auth.routes.js';
import activitiesRoutes from './activities.routes.js';
import recommendRoutes from './recommend.routes.js';
import favoritesRoutes from './favorites.routes.js';
import historyRoutes from './history.routes.js';
import feedbackRoutes from './feedback.routes.js';
import * as healthController from '../controllers/health.controller.js';

const router = Router();

// Health check
router.get('/health', healthController.check);

// API routes
router.use('/auth', authRoutes);
router.use('/activities', activitiesRoutes);
router.use('/recommend', recommendRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/history', historyRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
