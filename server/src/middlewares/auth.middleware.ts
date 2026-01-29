import { Response, NextFunction } from 'express';
import { AuthRequest, UserPayload, ApiError } from '../types/index.js';
import { extractTokenFromHeader, verifyToken } from '../utils/jwt.js';
import { prisma } from '../utils/prisma.js';

/**
 * Required JWT authentication middleware
 * Throws 401 if no valid token
 */
export async function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired token');
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', 'User not found');
    }

    req.user = user as UserPayload;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional JWT authentication middleware
 * Attaches user if valid token, continues otherwise
 */
export async function optionalAuthMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return next();
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return next();
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });

    if (user) {
      req.user = user as UserPayload;
    }

    next();
  } catch {
    // Silently continue without user
    next();
  }
}
