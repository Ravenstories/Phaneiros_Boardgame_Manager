import request from 'supertest';
import { app, server } from '../backend/server.js';

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
