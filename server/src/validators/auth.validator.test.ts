import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from './auth.validator.js';

describe('registerSchema', () => {
  it('should accept valid registration input', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      city: 'Istanbul',
    });
    expect(result.success).toBe(true);
  });

  it('should accept registration without city', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const result = registerSchema.safeParse({
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('should reject password shorter than 6 chars', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty body', () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should accept password exactly 6 chars', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'abcdef',
    });
    expect(result.success).toBe(true);
  });

  it('should include proper error messages', () => {
    const result = registerSchema.safeParse({
      email: 'invalid',
      password: '12',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      expect(messages).toContain('Geçerli bir email adresi giriniz');
      expect(messages).toContain('Şifre en az 6 karakter olmalı');
    }
  });
});

describe('loginSchema', () => {
  it('should accept valid login input', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'bad-email',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'abc',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty body', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const result = loginSchema.safeParse({ password: '123456' });
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(false);
  });
});
