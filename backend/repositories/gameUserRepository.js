import { supabase } from '../supabaseClient.js';

export async function assignUserToGame(user_id, game_id, role) {
  const { data, error } = await supabase
    .from('game_users')
    .insert({ user_id, game_id, role })
    .select()
    .single();
  if (error) {
    // If the user is already assigned to this game, update their role instead
    if (error.code === '23505') {
      return await updateAssignment(user_id, game_id, role);
    }
    const err = new Error(error.message);
    err.code = error.code;
    err.status = 400;
    throw err;
  }
  return data;
}

export async function listGameUsers(game_id) {
  const { data, error } = await supabase
    .from('game_users')
    .select('*')
    .eq('game_id', game_id);
  if (error) {
    const err = new Error(error.message);
    err.code = error.code;
    err.status = 400;
    throw err;
  }
  return data;
}

export async function updateAssignment(user_id, game_id, role) {
  const { data, error } = await supabase
    .from('game_users')
    .update({ role })
    .eq('user_id', user_id)
    .eq('game_id', game_id)
    .select()
    .single();
  if (error) {
    const err = new Error(error.message);
    err.code = error.code;
    err.status = 400;
    throw err;
  }
  return data;
}

export async function listUserGames(user_id) {
  const { data, error } = await supabase
    .from('game_users')
    .select('*')
    .eq('user_id', user_id);
  if (error) {
    const err = new Error(error.message);
    err.code = error.code;
    err.status = 400;
    throw err;
  }
  return data;
}

export async function getAssignment(user_id, game_id) {
  const { data, error } = await supabase
    .from('game_users')
    .select('*')
    .eq('user_id', user_id)
    .eq('game_id', game_id)
    .maybeSingle();
  if (error) {
    const err = new Error(error.message);
    err.code = error.code;
    err.status = 400;
    throw err;
  }
  return data;
}