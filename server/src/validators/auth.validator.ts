import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  city: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
});

export const verifyResetCodeSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  code: z.string().length(6, 'Kod 6 haneli olmalı'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  code: z.string().length(6, 'Kod 6 haneli olmalı'),
  newPassword: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetCodeInput = z.infer<typeof verifyResetCodeSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
