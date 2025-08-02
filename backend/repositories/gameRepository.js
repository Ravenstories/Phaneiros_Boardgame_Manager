import { supabase } from '../supabaseClient.js';
import { sqlHelper } from '../library/sqlHelper.js';
import * as logger from '../library/logger.js';

const SQL = {
  LIST   : sqlHelper('game/get_all.sql'),
  GET_ONE: sqlHelper('game/get_one.sql'),
  CREATE : sqlHelper('game/create.sql'),
  DELETE : sqlHelper('game/delete.sql'),
  UPDATE : sqlHelper('game/update.sql'),
  TYPES  : sqlHelper('game/get_types.sql'),
};

export async function getAllGames () {
  const { data, error } = await supabase.rpc('exec_sql',
    { sql_text: SQL.LIST, params: {} });
  if (error) {
    logger.error('[getAllGames] RPC error', error);
    throw new Error(error.message);
  }
  logger.log('[getAllGames] result', data);
  return data;
}

export async function getGameById(gameId) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_text: SQL.GET_ONE,
    params  : { game_id: gameId },     // snake_case ⇄ :game_id
  });
  if (error) throw error;
  return data[0] ?? null;
}

export async function createGame (gameType = 'kingdom', gameName) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_text: SQL.CREATE,
    params: { game_type: gameType, game_name: gameName },
  });
  if (error) throw new Error(error.message);
  return data[0].game_id;
}

export async function deleteGame (gameId) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_text: SQL.DELETE,
    params  : { game_id: gameId },     // snake_case ⇄ :game_id
  });
  if (error) throw new Error(error.message);
  return data[0].game_id;
}

export async function updateGame (gameId, updates) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_text: SQL.UPDATE,
    params  : { game_id: gameId, ...updates }, // snake_case ⇄ :game_id
  });
  if (error) throw new Error(error.message);
  return data[0];
}

export async function getGameTypes() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_text: SQL.TYPES,
    params  : {},
  });
  if (error) throw new Error(error.message);
  return data.map(row => row.game_type);
}