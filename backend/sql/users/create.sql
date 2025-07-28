create table if not exists users (
  id serial primary key,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('Admin','Game Master','Player','Guest')),
  name text,
  birthdate date,
  address text,
  phone text,
  requested_games text,
  requested_role text
);