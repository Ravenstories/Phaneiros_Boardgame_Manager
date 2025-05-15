select game_id,
       game_type,
       created_at,
       status                -- add any extra columns you want to show
from   game
where  game_id = :game_id;
