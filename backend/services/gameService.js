import * as repo from '../repositories/gameRepository.js';
import * as gameUserRepo from '../repositories/gameUserRepository.js';

export const GameService = {
  list: () => repo.getAllGames(),
  get(id) {
    return repo.getGameById(id);
  },
  listTypes() {
    return repo.getGameTypes();
  },
  async create(type, name, creatorId) {
  const id = await repo.createGame(type, name);
  if (creatorId) {
    try {
      await gameUserRepo.assignUserToGame(creatorId, id, 'Game Master');
    } catch (err) {
        // ignore assignment failure; game still created
        console.error(err);
      }
    }
    return id;
  },
  delete(id) {
    return repo.deleteGame(id);
  },
};

export default GameService;