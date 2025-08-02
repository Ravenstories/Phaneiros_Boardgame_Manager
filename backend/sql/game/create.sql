insert into game (game_type, game_name)
values (:game_type, :game_name)
returning game_id;