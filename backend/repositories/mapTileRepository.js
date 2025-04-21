import { supabase } from '../supabaseClient.js';

/**
 * Get **all** territories (aka map tiles).
 */
export async function getAllTiles() {
  const { data, error } = await supabase.from('territory').select(`
      territory_id   ,
      game_id        ,
      label          ,
      size           ,
      terrain_type_id,
      created_at
  `);

  if (error) throw new Error(error.message);
  return data;          // array of rows
}

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
