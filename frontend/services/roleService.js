// frontend/services/roleService.js
import { getUser } from './userStore.js';

export const RolePriority = {
  Guest: 0,
  Player: 1,
  'Game Master': 2,
  Admin: 3
};

export function hasPermission(requiredRole) {
  const userRole = getUser()?.role || 'Guest';
  return RolePriority[userRole] >= RolePriority[requiredRole];
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

