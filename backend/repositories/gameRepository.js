import { supabase } from '../supabaseClient.js';

export async function getAllGames() {
  const { data, error } = await supabase
    .from('game')
    .select('game_id, game_type, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createGame(gameType = 'kingdom') {
  const { data, error } = await supabase
    .from('game')
    .insert({ game_type: gameType })
    .select('game_id')
    .single();

  if (error) throw new Error(error.message);
  return data.game_id;
}