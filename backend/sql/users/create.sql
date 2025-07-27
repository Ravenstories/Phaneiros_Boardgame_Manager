create table if not exists users (
  id serial primary key,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('Admin','Game Master','Player','Guest'))
);