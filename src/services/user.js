import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function queryUser(params) {
  return request('/api/user/queryByPage', {
    params
  });
}

export async function updateUser(params) {
  return request('/api/user/update', {
    method: 'POST',
    data: params,
  });
}

export async function createUser(params) {
  return request('/api/user/create', {
    method: 'POST',
    data: params,
  });
}

export async function deleteUser(params) {
  return request('/api/user/delete', {
    method: 'POST',
    data: params,
  });
}
