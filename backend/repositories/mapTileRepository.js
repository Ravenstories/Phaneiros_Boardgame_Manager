import { supabase } from '../supabaseClient.js';
import { sqlHelper } from '../library/sqlHelper.js';
import * as logger from '../library/logger.js';

const SQL = {
  GET_ALL_TILES: sqlHelper('territory/get_all_tiles.sql'),
};

/**
 * Find one tile by its UUID, or return null.
 */
export async function getTileById(id) {
  const { data, error } = await supabase
    .from('territory')
    .select('*')
    .eq('territory_id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data ?? null;
}

export async function getAllTiles(game_id) {
  logger.log('getAllTiles', game_id);
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_text: SQL.GET_ALL_TILES,
    params  : { game_id: game_id }          // ← snake case matches :game_id
  });
  if (error) throw error;
  return data;
}