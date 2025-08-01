import request from 'supertest';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

const mockUserService = {
  registerUser: jest.fn(async () => ({})),
  loginUser: jest.fn(),
  verifyToken: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  listUsers: jest.fn(),
  updateRole: jest.fn(),
  assignUserToGame: jest.fn(),
  listGameUsers: jest.fn(async () => []),
  updateAssignment: jest.fn(),
  listUserGames: jest.fn(),
  getGameAssignment: jest.fn(async () => null),
};

jest.unstable_mockModule('../backend/services/userService.js', () => mockUserService);

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
      maybeSingle: jest.fn(async () => ({ data: null, error: null })),
    })),
  }),
}));

mockUserService.verifyToken.mockImplementation(async token =>
  jwt.verify(token, process.env.JWT_SECRET)
);

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

describe('Game user assignment endpoint', () => {
  it('requires admin token', async () => {
    const token = jwt.sign({ id: 1, role: 'user' }, process.env.JWT_SECRET);
    await request(app)
      .post('/api/games/1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: 2, role: 'player' })
      .expect(403);
  });


  afterAll(done => {
    server?.close(done);
    if (!server) done();
  });
});

describe('Game users listing endpoint', () => {
  it('forbids non-gm', async () => {
    const token = jwt.sign({ id: 1, role: 'Player' }, process.env.JWT_SECRET);
    await request(app)
      .get('/api/games/1/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('allows game master', async () => {
    mockUserService.getGameAssignment.mockResolvedValueOnce({ role: 'Game Master' });
    mockUserService.listGameUsers.mockResolvedValueOnce([]);
    const token = jwt.sign({ id: 1, role: 'Game Master' }, process.env.JWT_SECRET);
    await request(app)
      .get('/api/games/1/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(done => {
    server?.close(done);
    if (!server) done();
  });
});