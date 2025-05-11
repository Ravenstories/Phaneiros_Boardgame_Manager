import { supabase } from '../supabaseClient.js';
import { sqlHelper } from '../library/sqlHelper.js';

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

// Get all tiles for a gameId
// This is a SQL function that returns a set of rows.
// It takes a gameId as an argument and returns all tiles for that game.
const sql = sqlHelper('territory/get_all_tiles.sql');
const QUERY_ALL_TILES = sqlHelper('territory/get_all_tiles.sql');
export async function getAllTiles (gameId) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_text: QUERY_ALL_TILES,
    params: { gameId }
  });
  if (error) throw new Error(error.message);
  return data;          // array of rows
}
