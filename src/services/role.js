import request from "@/utils/request";

export async function queryRole(params) {
  return request('/api/role/queryByPage', {
    params,
  });
}

export async function updateRole(params) {
  return request('/api/role/update', {
    method: 'POST',
    data: params,
  });
}

export async function createRole(params) {
  return request('/api/role/create', {
    method: 'POST',
    data: params,
  });
}

export async function deleteRole(params) {
  return request('/api/role/delete', {
    method: 'POST',
    data: params,
  });
}

export async function queryAllRole() {
  return request('/api/role/query');
}

