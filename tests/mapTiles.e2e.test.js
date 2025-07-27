// tests/mapTiles.e2e.test.mjs
import request from 'supertest';
//import { app, server } from '../backend/server.js';
import { jest } from '@jest/globals';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

// Mock the Supabase client with simple dummy behaviour
const rpcMock = jest.fn(async (_proc, args) => {
  if (args?.params?.game_id) {
    // return one dummy tile for any game
    return { data: [{ x: 0, y: 0, terrain_type_id: 1 }], error: null };
  }
  // games list
  return { data: [{ game_id: 1, game_type: 'kingdom' }], error: null };
});

jest.unstable_mockModule('@supabase/supabase-js', () => ({
  createClient: () => ({
    rpc: rpcMock,
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
/**
 * Helper: ask for games, then tiles, until we find one with >0 tiles.
 * Throws if none have tiles (so the test fails clearly).
 */
async function findGameWithTiles() {
  const gamesRes = await request(app).get('/api/games').expect(200);
  for (const g of gamesRes.body) {
    const tilesRes = await request(app)
      .get(`/api/games/${g.game_id}/tiles`)
      .expect(200)
      .expect('content-type', /json/);

    if (Array.isArray(tilesRes.body) && tilesRes.body.length) {
      return { game: g, tiles: tilesRes.body };
    }
  }
  throw new Error('No game with tiles found in test database');
}

describe('Map tiles endpoint', () => {
  let gameId, tiles;

  beforeAll(async () => {
    ({ game: { game_id: gameId }, tiles } = await findGameWithTiles());
  });

  it('returns a non-empty array of tiles', () => {
    expect(Array.isArray(tiles)).toBe(true);
    expect(tiles.length).toBeGreaterThan(0);
  });

  it('each tile has required fields', () => {
    const required = ['x', 'y', 'terrain_type_id'];
    for (const t of tiles) {
      for (const key of required) {
        expect(t).toHaveProperty(key);
      }
    }
  });

  afterAll(done => {
    // if the server was started outside test env, close it
    server?.close(done);
    // if no listener, just call done()
    if (!server) done();
  });
});
