import * as argon2 from 'argon2';
import { prisma } from '../utils/prisma.js';
import { generateToken } from '../utils/jwt.js';
import { ApiError } from '../types/index.js';
import { RegisterInput, LoginInput } from '../validators/auth.validator.js';

export interface AuthResult {
  accessToken: string;
  user: {
    id: string;
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
      email: user.email,
      city: user.city,
      createdAt: user.createdAt,
    },
  };
}
