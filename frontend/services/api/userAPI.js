import { httpPost, httpPut, httpDelete, httpGet } from '../httpService.js';
import { getToken } from '../userStore.js';

export async function signupUser(signupData) {
  return await httpPost('/api/signup', signupData);
}

export async function loginUser(email, password) {
  const response = await httpPost('/api/login', { email, password });
  localStorage.setItem('token', response.token);
  return response;
}

export async function getSession() {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return await httpGet('/api/session', headers);
}

export async function updateUser(id, updateData) {
  return await httpPut(`/api/users/${id}`, updateData);
}

export async function deleteUser(id) {
  return await httpDelete(`/api/users/${id}`);
}
