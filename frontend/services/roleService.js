// frontend/services/roleService.js
import { supabase } from './supabaseClient.js';

export const RolePriority = {
  Guest: 0,
  Player: 1,
  GameMaster: 2,
  Admin: 3
};

export function hasPermission(userRole, requiredRole) {
  return RolePriority[userRole] >= RolePriority[requiredRole];
}

export async function getUserRole(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('role_id, roles (name)')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to fetch user role:', error);
    return null;
  }

  return data.roles?.name || null;
}
export async function updateUserRole(userId, roleName) {
  const { data, error } = await supabase
    .from('users')
    .update({ role_id: roleName })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update user role:', error);
    return null;
  }

  return data;
}

export async function listRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('*');

  if (error) {
    console.error('Failed to list roles:', error);
    return [];
  }

  return data;
}

