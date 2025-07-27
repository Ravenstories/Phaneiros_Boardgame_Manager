import { jest } from '@jest/globals';

// Mock the repository module before importing the service
jest.unstable_mockModule('../backend/repositories/gameRepository.js', () => ({
  getGameById: jest.fn(),
  getAllGames: jest.fn(),
  createGame: jest.fn(),
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
