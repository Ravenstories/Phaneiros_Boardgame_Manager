insert into game (game_type, game_name)
values (:gameType, :gameName)
returning game_id;