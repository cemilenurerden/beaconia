import { Router, RequestHandler } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { preferencesSchema } from '../validators/user.validator.js';

const router = Router();

// All user routes require authentication
router.use(authMiddleware as unknown as RequestHandler);

router.get('/stats', userController.getStats as unknown as RequestHandler);
router.get('/preferences', userController.getPreferences as unknown as RequestHandler);
router.put(
  '/preferences',
  validateBody(preferencesSchema),
  userController.updatePreferences as unknown as RequestHandler
);

export default router;
