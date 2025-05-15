insert into game (game_type)
values (:gameType)
returning game_id;
