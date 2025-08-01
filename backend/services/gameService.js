gamesRouter.post('/', authenticate, express.json(), async (req, res) => {
  try {
    const id = await GameService.create(req.body.game_type, req.user.id);
    res.status(201).json({ game_id: id });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ────────────────────────────────────────────────
   DELETE /api/games/:game_id   → delete game
   ──────────────────────────────────────────────── */
gamesRouter.delete('/:game_id', authenticate, requireGameMaster('game_id'), async (req, res) => {
  try {
    await GameService.delete(req.params.game_id);
    res.status(204).end();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
});