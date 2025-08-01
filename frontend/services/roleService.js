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


