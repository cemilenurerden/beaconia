import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { sendError } from '../utils/response.js';

const handler = (_req: Request, res: Response) =>
  sendError(res, 'RATE_LIMIT_EXCEEDED', 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.', 429);

// Kod doğrulama endpoint'lerinde email bazlı rate limiting —
// böylece saldırgan kaç IP kullanırsa kullansın aynı hesap korunur.
const emailKey = (req: Request): string => {
  const email = (req.body?.email as string | undefined)?.toLowerCase().trim();
  return email ?? req.ip ?? 'unknown';
};

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true, // yalnızca başarısız denemeler sayılır
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// Email bazlı: bir inbox'a saatte 3'ten fazla reset kodu gönderilemesin.
export const forgotPasswordRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailKey,
  handler,
});

// Email bazlı: aynı hesap için saatte 5 doğrulama denemesi.
export const verifyEmailRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailKey,
  handler,
});

// Email bazlı: aynı hesap için saatte 3 kod yeniden gönderme.
export const resendVerificationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailKey,
  handler,
});

// Email bazlı: şifre sıfırlama kodu doğrulama — önceden rate limit yoktu.
export const verifyResetCodeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailKey,
  handler,
});

// Email bazlı: şifre sıfırlama işlemi — önceden rate limit yoktu.
export const resetPasswordRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailKey,
  handler,
});

// IP bazlı: geçerli token olmadan zaten kullanılamaz, ek güvence olarak.
export const refreshRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// IP bazlı: anonim kullanıcılar dahil herkese uygulanan public endpoint limiti.
export const recommendRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// IP bazlı: auth gerektirmeyen public activities listesi.
export const activitiesRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});
