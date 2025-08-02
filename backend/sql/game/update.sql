update game set
  game_type = :game_type,
  game_name = :game_name
where game_id = :game_id
returning game_id;