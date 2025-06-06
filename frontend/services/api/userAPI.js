import { httpPost, httpPut, httpDelete, httpGet } from '../httpService.js';

export async function signupUser(email, password) {
  return await httpPost('/api/signup', { email, password });
}

export async function loginUser(email, password) {
  const response = await httpPost('/api/login', { email, password });
  localStorage.setItem('token', response.token);
  return response;
}

export async function getSession() {
  return await httpGet('/api/session');
}

export async function updateUser(id, updateData) {
  return await httpPut(`/api/users/${id}`, updateData);
}

export async function deleteUser(id) {
  return await httpDelete(`/api/users/${id}`);
}
