import { z } from 'zod';

export const preferencesSchema = z.object({
  duration: z.number().int().min(5).max(480),
  energy: z.enum(['low', 'medium', 'high']),
  location: z.enum(['home', 'outdoor', 'any']),
  cost: z.enum(['free', 'low', 'medium']),
  social: z.enum(['solo', 'friends', 'both']),
  mood: z.string().max(100).optional(),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı').max(100).optional(),
  city: z.string().min(2, 'Şehir en az 2 karakter olmalı').max(100).nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gerekli'),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalı'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
