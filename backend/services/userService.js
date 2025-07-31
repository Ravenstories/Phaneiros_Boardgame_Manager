import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepository.js';
import * as gameUserRepo from '../repositories/gameUserRepository.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set');
}

export async function registerUser(email, password, details = {}) {
  const existing = await userRepo.getUserByEmail(email);
  if (existing) throw new Error('Email already in use');
  const hash = await bcrypt.hash(password, 10);
  const created = await userRepo.createUser(email, hash, 'Guest', details);
  return created;
}

export async function loginUser(email, password) {
  const user = await userRepo.getUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid email or password');
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

export async function verifyToken(token) {
  const payload = jwt.verify(token, JWT_SECRET);
  const user = await userRepo.getUserById(payload.id);
  if (!user) throw new Error('Invalid user');
  const { password_hash, ...safe } = user;
  return safe;
}

export async function updateUser(id, updateData) {
  const { password_hash, ...user } =
    await userRepo.updateUser(id, updateData);
  return user;
}

export async function deleteUser(id) {
  return await userRepo.deleteUser(id);
}

export async function listUsers() {
  return await userRepo.listUsers();
}

export async function updateRole(id, role) {
  return await userRepo.updateRole(id, role);
}

export async function assignUserToGame(user_id, game_id, role) {
  return await gameUserRepo.assignUserToGame(user_id, game_id, role);
}

export async function listGameUsers(game_id) {
  return await gameUserRepo.listGameUsers(game_id);
}

export async function updateAssignment(user_id, game_id, role) {
  return await gameUserRepo.updateAssignment(user_id, game_id, role);
}

export async function listUserGames(user_id) {
  return await gameUserRepo.listUserGames(user_id);
}

export async function getGameAssignment(user_id, game_id) {
  return await gameUserRepo.getAssignment(user_id, game_id);
}