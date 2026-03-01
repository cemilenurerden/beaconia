import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}


export function generateAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwtRefreshSecret, { expiresIn: '30d' });

}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
