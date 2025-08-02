import request from 'supertest';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

// Minimal user service mock for authentication
const mockUserService = {
  verifyToken: jest.fn(async token => jwt.verify(token, process.env.JWT_SECRET)),
};

jest.unstable_mockModule('../backend/services/userService.js', () => mockUserService);

// Mock GameService to isolate route behaviour
const mockGameService = {
  list: jest.fn(),
  get: jest.fn(),
  listTypes: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

jest.unstable_mockModule('../backend/services/gameService.js', () => ({
  GameService: mockGameService,
}));

// Mock Supabase client to avoid configuration during tests
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

describe('Games API', () => {
  afterAll(done => {
    server?.close(done);
    if (!server) done();
  });

  it('lists existing game types', async () => {
    mockGameService.listTypes.mockResolvedValueOnce(['alpha', 'beta']);
    const res = await request(app).get('/api/games/types').expect(200);
    expect(res.body).toEqual(['alpha', 'beta']);
    expect(mockGameService.listTypes).toHaveBeenCalled();
  });

  it('creates a game with a new type', async () => {
    mockGameService.create.mockResolvedValueOnce('123');
    const token = jwt.sign({ id: 7, role: 'Game Master' }, process.env.JWT_SECRET);
    const res = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${token}`)
      .send({ game_type: 'newType', game_name: 'My Game' })
      .expect(201);

    expect(res.body).toEqual({ game_id: '123' });
    expect(mockGameService.create).toHaveBeenCalledWith('newType', 'My Game', 7);
  });
});