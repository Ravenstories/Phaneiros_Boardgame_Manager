create table if not exists game_users (
  user_id integer references users(id) on delete cascade,
  game_id uuid references game(game_id) on delete cascade,
  role text not null,
  primary key (user_id, game_id)
);