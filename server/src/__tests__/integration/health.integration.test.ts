import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });

  it('should include timestamp', async () => {
    const res = await request(app).get('/health');
    expect(res.body.data.timestamp).toBeDefined();
    expect(new Date(res.body.data.timestamp).getTime()).not.toBeNaN();
  });
});
