import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepository.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set');
}

export async function registerUser(email, password) {
  const existing = await userRepo.getUserByEmail(email);
  if (existing) throw new Error('Email already in use');
  const hash = await bcrypt.hash(password, 10);
  return await userRepo.createUser(email, hash);
}

export async function loginUser(email, password) {
  const user = await userRepo.getUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid email or password');
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

export async function verifyToken(token) {
  const payload = jwt.verify(token, JWT_SECRET);
  const user = await userRepo.getUserById(payload.id);
  if (!user) throw new Error('Invalid user');
  return { id: user.id, email: user.email };
}

export async function updateUser(id, updateData) {
  return await userRepo.updateUser(id, updateData);
}

export async function deleteUser(id) {
  return await userRepo.deleteUser(id);
}