import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { RegisterInput, LoginInput, ForgotPasswordInput, VerifyResetCodeInput, ResetPasswordInput, RefreshTokenInput, VerifyEmailInput, ResendVerificationInput } from '../validators/auth.validator.js';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as RegisterInput;
    const result = await authService.register(input);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as LoginInput;
    const result = await authService.login(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as ForgotPasswordInput;
    const result = await authService.forgotPassword(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function verifyResetCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as VerifyResetCodeInput;
    const result = await authService.verifyResetCode(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as ResetPasswordInput;
    const result = await authService.resetPassword(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body as RefreshTokenInput;
    const result = await authService.refresh(refreshToken);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    sendSuccess(res, { message: 'Çıkış yapıldı' });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as VerifyEmailInput;
    const result = await authService.verifyEmail(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function resendVerificationCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as ResendVerificationInput;
    const result = await authService.resendVerificationCode(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
