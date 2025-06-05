import request from 'supertest';
import { app } from '../backend/server.js';

/*
const request = require('supertest');
const { app } = require('../backend/server.js');
*/

// Use a fixed game ID for testing
const GAME_ID = 'f2190dd0-a51a-4eb6-9748-811a4fe14fa2';

describe('Bootstrap served locally', () => {
  it('css and js return 200', async () => {
    await request(app)
      .get('/vendor/bootstrap/css/bootstrap.min.css')
      .expect(200)
      .expect('content-type', /css/);

    await request(app)
      .get('/vendor/bootstrap/js/bootstrap.bundle.min.js')
      .expect(200)
      .expect('content-type', /javascript/);
  });
});

describe('GET /api/games/:id/tiles', () => {
  it('returns array of tiles as JSON', async () => {
    const res = await request(app)
      .get(`/api/games/${GAME_ID}/tiles`)
      .expect('content-type', /json/)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    // optional: at least one tile exists
    expect(res.body.length).toBeGreaterThan(0);
    // optional: check required fields
    expect(res.body[0]).toHaveProperty('x');
    expect(res.body[0]).toHaveProperty('y');
    expect(res.body[0]).toHaveProperty('terrain_name');
  });
});
