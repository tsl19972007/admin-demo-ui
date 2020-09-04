import request from '@/utils/request';

export async function login(username, password) {
  return request(`/api/auth/login?username=${username}&&password=${password}`);
}

export async function logout() {
  return request(`/api/auth/logout`);
}

export async function getCurrentUser() {
  return request(`/api/auth/currentUser`);
}
