import * as repo from '../repositories/gameRepository.js';

export const GameService = {
  list: () => repo.getAllGames(),
  create: (type) => repo.createGame(type)
};
