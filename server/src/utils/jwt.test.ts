import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken, extractTokenFromHeader } from './jwt.js';

const TEST_SECRET = 'test-secret-key';

describe('generateToken', () => {
  it('should return a valid JWT string', () => {
    const token = generateToken('user-123');
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should include sub claim with userId', () => {
    const token = generateToken('user-123');
    const decoded = jwt.decode(token) as any;
    expect(decoded.sub).toBe('user-123');
  });

  it('should include iat and exp claims', () => {
    const token = generateToken('user-123');
    const decoded = jwt.decode(token) as any;
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});

describe('verifyToken', () => {
  it('should return payload for a valid token', () => {
    const token = generateToken('user-456');
    const payload = verifyToken(token);
    expect(payload).not.toBeNull();
    expect(payload!.sub).toBe('user-456');
  });

  it('should return null for an invalid token', () => {
    const payload = verifyToken('invalid-token');
    expect(payload).toBeNull();
  });

  it('should return null for an expired token', () => {
    const token = jwt.sign({ sub: 'user-789' }, TEST_SECRET, { expiresIn: '-1s' });
    const payload = verifyToken(token);
    expect(payload).toBeNull();
  });

  it('should return null for a token signed with wrong secret', () => {
    const token = jwt.sign({ sub: 'user-789' }, 'wrong-secret', { expiresIn: '7d' });
    const payload = verifyToken(token);
    expect(payload).toBeNull();
  });
});

describe('extractTokenFromHeader', () => {
  it('should extract token from Bearer header', () => {
    const token = extractTokenFromHeader('Bearer my-token-123');
    expect(token).toBe('my-token-123');
  });

  it('should return null for undefined header', () => {
    const token = extractTokenFromHeader(undefined);
    expect(token).toBeNull();
  });

  it('should return null for header without Bearer prefix', () => {
    const token = extractTokenFromHeader('Basic abc123');
    expect(token).toBeNull();
  });

  it('should return null for empty string', () => {
    const token = extractTokenFromHeader('');
    expect(token).toBeNull();
  });

  it('should handle Bearer with empty token', () => {
    const token = extractTokenFromHeader('Bearer ');
    expect(token).toBe('');
  });
});
