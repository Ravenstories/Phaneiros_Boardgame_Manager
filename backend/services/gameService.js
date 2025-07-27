import * as repo from '../repositories/gameRepository.js';

export const GameService = {
  list: () => repo.getAllGames(),
  get(id) {
    return repo.getGameById(id);
  },
  create: (type) => repo.createGame(type),
};
