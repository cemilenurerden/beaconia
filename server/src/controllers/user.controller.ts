import { Response, NextFunction } from 'express';
import multer from 'multer';
import * as userService from '../services/user.service.js';
import { cloudinary } from '../config/cloudinary.js';
import { sendSuccess } from '../utils/response.js';
import { AuthRequest, ApiError } from '../types/index.js';

export const upload = multer({ storage: multer.memoryStorage() });

export async function getStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const stats = await userService.getStats(userId);
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
}

export async function getPreferences(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const preferences = await userService.getPreferences(userId);
    sendSuccess(res, preferences);
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const preferences = await userService.updatePreferences(userId, req.body);
    sendSuccess(res, preferences);
  } catch (error) {
    next(error);
  }
}

export async function getProfileAnalysis(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const analysis = await userService.getProfileAnalysis(userId);
    sendSuccess(res, analysis);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const user = await userService.updateProfile(userId, req.body);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    await userService.changePassword(userId, req.body);
    sendSuccess(res, { message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    await userService.deleteAccount(userId);
    sendSuccess(res, { message: 'Hesap silindi.' });
  } catch (error) {
    next(error);
  }
}

export async function getSelfAnalysis(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const insights = await userService.getSelfAnalysis(userId);
    sendSuccess(res, insights);
  } catch (error) {
    next(error);
  }
}

export async function uploadProfilePhoto(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;

    if (!req.file) throw new ApiError(400, 'NO_FILE', 'Dosya bulunamadı.');

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'beaconia/profile_photos', public_id: `user_${userId}`, overwrite: true },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result as { secure_url: string });
        }
      ).end(req.file!.buffer);
    });

    await userService.updateProfilePhoto(userId, result.secure_url);
    sendSuccess(res, { profilePhoto: result.secure_url });
  } catch (error) {
    next(error);
  }
}