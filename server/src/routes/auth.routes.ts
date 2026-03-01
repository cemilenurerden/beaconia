import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema, forgotPasswordSchema, verifyResetCodeSchema, resetPasswordSchema, refreshTokenSchema } from '../validators/auth.validator.js';
import { loginRateLimit, registerRateLimit, forgotPasswordRateLimit } from '../middlewares/rateLimit.middleware.js';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already registered
 */
router.post('/register', registerRateLimit, validateBody(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginRateLimit, validateBody(loginSchema), authController.login);

router.post('/forgot-password', forgotPasswordRateLimit, validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-reset-code', validateBody(verifyResetCodeSchema), authController.verifyResetCode);
router.post('/reset-password', validateBody(resetPasswordSchema), authController.resetPassword);
router.post('/refresh', validateBody(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
