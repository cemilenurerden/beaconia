import * as argon2 from 'argon2';
import crypto from 'crypto';
import { prisma } from '../utils/prisma.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../types/index.js';
import { RegisterInput, LoginInput, ForgotPasswordInput, VerifyResetCodeInput, ResetPasswordInput, VerifyEmailInput, ResendVerificationInput } from '../validators/auth.validator.js';
import { sendPasswordResetCode, sendEmailVerificationCode } from './email.service.js';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    city: string | null;
    profilePhoto: string | null;
    emailVerified: boolean;
    createdAt: Date;
  };
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new ApiError(409, 'CONFLICT', 'Email already registered');
  }

  // Hash password
  const passwordHash = await argon2.hash(input.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      city: input.city,
    },
  });

  // E-posta doğrulama kodu üret ve kaydet
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const verificationCodeHash = crypto.createHash('sha256').update(verificationCode).digest('hex');

  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      codeHash: verificationCodeHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  // Email gönderimi başarısız olsa bile kayıt tamamlanır;
  // kullanıcı verify-email ekranından "Tekrar Gönder" ile kod alabilir.
  try {
    await sendEmailVerificationCode({ email: user.email, code: verificationCode, name: user.name });
  } catch (e) {
    console.error('Kayıt email gönderilemedi:', e);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
      profilePhoto: user.profilePhoto ?? null,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await argon2.verify(user.passwordHash, input.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid credentials');
  }

  if (!user.emailVerified) {
    throw new ApiError(403, 'EMAIL_NOT_VERIFIED', 'Email adresinizi doğrulamanız gerekiyor');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Süresi dolmuş token'ları temizle + yeni token ekle
  await prisma.$transaction([
    prisma.refreshToken.deleteMany({
      where: { userId: user.id, expiresAt: { lt: new Date() } },
    }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
      profilePhoto: user.profilePhoto ?? null,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  };
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Geçersiz refresh token');
  }

  const tokenHash = hashToken(refreshToken);
  const newAccessToken = generateAccessToken(payload.sub);
  const newRefreshToken = generateRefreshToken(payload.sub);
  const newTokenHash = hashToken(newRefreshToken);
  const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Token rotation — atomik: delete + create tek transaction'da
  await prisma.$transaction(async (tx) => {
    const stored = await tx.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.expiresAt < new Date()) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Geçersiz veya süresi dolmuş refresh token');
    }

    await tx.refreshToken.delete({ where: { tokenHash } });
    await tx.refreshToken.create({
      data: {
        userId: payload.sub,
        tokenHash: newTokenHash,
        expiresAt: newExpiresAt,
      },
    });
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Email enumeration koruması: kayıtsız email için de aynı mesaj
  if (!user) {
    return { message: 'Eğer bu email kayıtlıysa, doğrulama kodu gönderildi.' };
  }

  // Eski kodları sil
  await prisma.passwordReset.deleteMany({
    where: { userId: user.id },
  });

  // 6 haneli kod oluştur
  const code = crypto.randomInt(100000, 999999).toString();
  const codeHash = crypto.createHash('sha256').update(code).digest('hex');

  // DB'ye kaydet (15 dk geçerli)
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      codeHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  // Email gönder
  await sendPasswordResetCode({ email: user.email, code, name: user.name });

  return { message: 'Eğer bu email kayıtlıysa, doğrulama kodu gönderildi.' };
}

export async function verifyResetCode(input: VerifyResetCodeInput): Promise<{ message: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new ApiError(400, 'INVALID_CODE', 'Geçersiz veya süresi dolmuş kod');
  }

  const codeHash = crypto.createHash('sha256').update(input.code).digest('hex');

  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      codeHash,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetRecord) {
    throw new ApiError(400, 'INVALID_CODE', 'Geçersiz veya süresi dolmuş kod');
  }

  await prisma.passwordReset.update({
    where: { id: resetRecord.id },
    data: { verified: true },
  });

  return { message: 'Kod doğrulandı' };
}

export async function verifyEmail(input: VerifyEmailInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new ApiError(400, 'INVALID_CODE', 'Geçersiz veya süresi dolmuş kod');
  }

  if (user.emailVerified) {
    throw new ApiError(400, 'ALREADY_VERIFIED', 'Email zaten doğrulanmış');
  }

  const codeHash = crypto.createHash('sha256').update(input.code).digest('hex');

  const verificationRecord = await prisma.emailVerification.findFirst({
    where: {
      userId: user.id,
      codeHash,
      expiresAt: { gt: new Date() },
    },
  });

  if (!verificationRecord) {
    throw new ApiError(400, 'INVALID_CODE', 'Geçersiz veya süresi dolmuş kod');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    }),
    prisma.emailVerification.deleteMany({
      where: { userId: user.id },
    }),
    prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
      profilePhoto: user.profilePhoto ?? null,
      emailVerified: true,
      createdAt: user.createdAt,
    },
  };
}

export async function resendVerificationCode(input: ResendVerificationInput): Promise<{ message: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Email enumeration koruması
  if (!user || user.emailVerified) {
    return { message: 'Eğer bu email doğrulanmamış bir hesaba aitse, yeni kod gönderildi.' };
  }

  // Eski kodları sil
  await prisma.emailVerification.deleteMany({
    where: { userId: user.id },
  });

  // Yeni kod üret ve kaydet
  const code = crypto.randomInt(100000, 999999).toString();
  const codeHash = crypto.createHash('sha256').update(code).digest('hex');

  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      codeHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  await sendEmailVerificationCode({ email: user.email, code, name: user.name });

  return { message: 'Eğer bu email doğrulanmamış bir hesaba aitse, yeni kod gönderildi.' };
}

export async function resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new ApiError(400, 'INVALID_CODE', 'Geçersiz veya süresi dolmuş kod');
  }

  const codeHash = crypto.createHash('sha256').update(input.code).digest('hex');

  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      codeHash,
      verified: true,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetRecord) {
    throw new ApiError(400, 'INVALID_CODE', 'Geçersiz veya süresi dolmuş kod');
  }

  const passwordHash = await argon2.hash(input.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await prisma.passwordReset.deleteMany({
    where: { userId: user.id },
  });

  return { message: 'Şifre başarıyla güncellendi' };
}
