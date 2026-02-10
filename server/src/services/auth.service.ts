import * as argon2 from 'argon2';
import crypto from 'crypto';
import { prisma } from '../utils/prisma.js';
import { generateToken } from '../utils/jwt.js';
import { ApiError } from '../types/index.js';
import { RegisterInput, LoginInput, ForgotPasswordInput, VerifyResetCodeInput, ResetPasswordInput } from '../validators/auth.validator.js';
import { sendPasswordResetCode } from './email.service.js';

export interface AuthResult {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    city: string | null;
    createdAt: Date;
  };
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

  // Generate token
  const accessToken = generateToken(user.id);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
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

  // Generate token
  const accessToken = generateToken(user.id);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
      createdAt: user.createdAt,
    },
  };
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
