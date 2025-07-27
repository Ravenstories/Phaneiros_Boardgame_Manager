import request from 'supertest';
//import { app, server } from '../backend/server.js';
import { jest } from '@jest/globals';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

// Mock the Supabase client so no real credentials are required
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

describe('local Bootstrap assets', () => {
  it('CSS is served with 200', async () => {
    await request(app)
      .get('/vendor/bootstrap/css/bootstrap.min.css')
      .expect(200)
      .expect('content-type', /css/);
  });

  it('JS bundle is served with 200', async () => {
    await request(app)
      .get('/vendor/bootstrap/js/bootstrap.bundle.min.js')
      .expect(200)
      .expect('content-type', /javascript/);
  });

  afterAll(done => {
    server?.close(done);   // close listener when not in test env
    if (!server) done();
  });
});
