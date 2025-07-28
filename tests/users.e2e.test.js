import request from 'supertest';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

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
      .post('/api/signup')
      .send({ email: 'test@example.com', password: 'pw' })
      .expect(201);
  });

 afterAll(done => {
    server?.close(done);
    if (!server) done();
  });
});

describe('User role update endpoint', () => {
  it('forbids non-admins', async () => {
    const token = jwt.sign({ id: 1, role: 'user' }, process.env.JWT_SECRET);
    await request(app)
      .put('/api/users/2/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin' })
      .expect(403);
  });
  
  afterAll(done => {
    server?.close(done);
    if (!server) done();
  });
});