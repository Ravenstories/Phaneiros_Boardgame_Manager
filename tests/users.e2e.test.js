import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('@supabase/supabase-js', () => ({
  createClient: () => ({
    rpc: jest.fn(async () => ({ data: [], error: null })),
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(async () => ({ data: null, error: null })),
    })),
  }),
}));

const { app, server } = await import('../backend/server.js');

describe('User signup endpoint', () => {
  it('responds with 201', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@example.com', password: 'pw' })
      .expect(201);
  });

  afterAll(done => {
    server?.close(done);
    if (!server) done();
  });
});