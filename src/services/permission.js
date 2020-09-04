import request from "@/utils/request";

export async function queryPermission() {
  return request('/api/permission/queryByTree');
}

export async function updatePermission(params){
  return request('/api/permission/update', {
    method: 'POST',
    data: params,
  });
}

export async function createPermission(params){
  return request('/api/permission/create', {
    method: 'POST',
    data: params,
  });
}

export async function deletePermission(params){
  return request('/api/permission/delete', {
    method: 'POST',
    data: params,
  });
}

//将后端返回的permissions转换成TreeSelect需要的treeData数据格式
export const getTreeData = (permissions) => {
  let data = [];
  if (!permissions) return data;
  for (const p of permissions) {
    const {id, desc, children} = p;
    let node = {
      key: id,
      value: id,
      title: desc
    };
    node.children = getTreeData(children);
    data.push(node);
  }
  return data;
};
