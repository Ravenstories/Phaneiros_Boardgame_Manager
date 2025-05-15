import * as repo from '../repositories/gameRepository.js';

export const GameService = {
  list: () => repo.getAllGames(),
  get: (id) => repo.getGameById(gameId),
  create: (type) => repo.createGame(type)
};
