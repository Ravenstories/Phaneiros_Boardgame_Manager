import { supabase }   from '../supabaseClient.js';
import { sqlHelper }  from '../library/sqlHelper.js';

const SQL = {
  LIST   : sqlHelper('game/get_all.sql'),
  CREATE : sqlHelper('game/create.sql'),
};

export async function getAllGames () {
  const { data, error } = await supabase.rpc('exec_sql',
    { sql_text: SQL.LIST, params: {} });
  if (error) {
    console.error('[getAllGames] RPC error', error);
    throw new Error(error.message);
  }
  console.log('[getAllGames] result', data); 
  return data;
}

export async function createGame (gameType = 'kingdom') {
  const { data, error } = await supabase.rpc('exec_sql',
    { sql_text: SQL.CREATE, params: { gameType } });
  if (error) throw new Error(error.message);
  return data[0].game_id;
}
