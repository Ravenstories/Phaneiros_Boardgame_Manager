import { jest } from '@jest/globals';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

// Mock supabase client to avoid real network/config
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

// Mock the repository module before importing the service
jest.unstable_mockModule('../backend/repositories/gameRepository.js', () => ({
  getGameById: jest.fn(),
  getAllGames: jest.fn(),
  createGame: jest.fn(),
  getGameTypes: jest.fn(),
}));

const repo = await import('../backend/repositories/gameRepository.js');
const { GameService } = await import('../backend/services/gameService.js');

describe('GameService.get', () => {
  it('calls repo.getGameById with the given id', async () => {
    const fakeGame = { game_id: 1 };
    repo.getGameById.mockResolvedValue(fakeGame);
    const result = await GameService.get(1);
    expect(repo.getGameById).toHaveBeenCalledWith(1);
    expect(result).toBe(fakeGame);
  });
});

describe('GameService.listTypes', () => {
  it('returns list of game types from repo', async () => {
    repo.getGameTypes.mockResolvedValue(['a', 'b']);
    const types = await GameService.listTypes();
    expect(repo.getGameTypes).toHaveBeenCalled();
    expect(types).toEqual(['a', 'b']);
  });
});