import * as repo from '../repositories/gameRepository.js';

export const GameService = {
  list: () => repo.getAllGames(),
  get: (id) => repo.getGameById(id),
  create: (type) => repo.createGame(type)
};
