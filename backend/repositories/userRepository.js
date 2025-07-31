import { supabase } from '../supabaseClient.js';

export const ROLE_IDS = {
  Admin: 1,
  'Game Master': 2,
  Player: 3,
  Guest: 4,
};

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, password_hash, role_id, roles(name)')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  if (!data) return null;
  const role = data.roles?.name || null;
  return { id: data.id, email: data.email, password_hash: data.password_hash, role };
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*, roles(name)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const role = data.roles?.name || null;
  return { ...data, role };
}

export async function createUser(email, password_hash, role = 'Guest', extra = {}) {
  const role_id = ROLE_IDS[role] || ROLE_IDS.Guest;
  const { data, error } = await supabase
    .from('users')
    .insert({ email, password_hash, role_id, ...extra })
    .select('id, email, role_id, roles(name)')
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id, email: data.email, role: data.roles?.name };
}

export async function updateUser(id, updateData) {
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select('*, roles(name)')
    .single();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const role = data.roles?.name || null;
  return { ...data, role };
}

export async function updateRole(id, role) {
  const role_id = ROLE_IDS[role];
  const { data, error } = await supabase
    .from('users')
    .update({ role_id })
    .eq('id', id)
    .select('id, email, role_id, roles(name)')
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id, email: data.email, role: data.roles?.name };
}

export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listUsers() {
  const { data, error } = await supabase.from('users').select('*, roles(name)');
  if (error) throw new Error(error.message);
  return data.map(u => ({ ...u, role: u.roles?.name }));
}