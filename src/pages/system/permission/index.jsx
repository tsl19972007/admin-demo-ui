import React, {useRef, useState} from 'react';
import {Button, Divider, Dropdown, Menu, message, Modal} from 'antd';
import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table'
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {queryPermission, updatePermission, createPermission, deletePermission} from '@/services/permission';

const PermissionList = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createFormValues, setCreateFormValues] = useState({});
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef();

  const onCreate = async values => {
    console.log('Received values of form: ', values);
    const toCreate = (({type, name, parentId, desc}) => ({type, name, parentId, desc}))(values);
    const hide = message.loading('正在新建');
    const res = await createPermission(toCreate);
    hide();
    if (res && res.code === 200) {
      message.success("新建成功");
      setCreateModalVisible(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const onUpdate = async values => {
    console.log('Received values of form: ', values);
    const toUpdate = (({id, desc}) => ({id, desc}))(values);
    const hide = message.loading('正在更新');
    const res = await updatePermission(toUpdate);
    hide();
    if (res && res.code === 200) {
      message.success("更新成功");
      setUpdateModalVisible(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const onDelete = async idList => {
    const hide = message.loading('正在删除');
    const res = await deletePermission(idList);
    hide();
    if (res && res.code === 200) {
      message.success("删除成功");
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const showDeleteConfirm = (idList) => {
    Modal.confirm({
      title: '确定删除权限吗？',
      onOk() {
        return onDelete(idList);
      },
    });
  };

  const columns = [
    {
      title: '权限名称',    //表头显示的名称
      dataIndex: 'name', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      hideInSearch: true,
    },
    {
      title: '权限描述',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '权限类型',
      dataIndex: 'type',
      hideInSearch: true,
      filters: false,
      valueEnum: {
        1: {text: '菜单'},
        2: {text: '按钮'}
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => {
            setUpdateModalVisible(true);
            setUpdateFormValues({...record})
          }}>修改</a>
          <Divider type="vertical"/>
          <Dropdown
            overlay={
              <Menu
                onClick={async e => {
                  if (e.key === 'delete') {
                    showDeleteConfirm(Array.of(record.id));
                  } else if (e.key === 'addNextLevel') {
                    setCreateFormValues({parentNode: record.desc, parentId: record.id});
                    setCreateModalVisible(true);
                  }
                }}>
                <Menu.Item key="addNextLevel">添加子权限</Menu.Item>
                <Menu.Item key="delete">删除权限</Menu.Item>
              </Menu>
            }
          >
            <a>更多 <DownOutlined/></a>
          </Dropdown>
        </>
      ),
    },
  ];

  return (<PageHeaderWrapper>
      <ProTable
        headerTitle="权限列表"    //表头
        actionRef={actionRef}    //用于触发刷新操作等，看api
        rowKey="id"                //表格行 key 的取值，可以是字符串或一个函数
        search={false}
        toolBarRender={(action, {selectedRowKeys}) => [
          <Button icon={<PlusOutlined/>} type="primary"
                  onClick={() => {
                    setCreateModalVisible(true);
                    setCreateFormValues({parentNode: "无", parentId: 1});
                  }}>添加根权限</Button>,
          selectedRowKeys && selectedRowKeys.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'delete') {
                      showDeleteConfirm(selectedRowKeys);
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="delete">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined/>
              </Button>
            </Dropdown>
          ),
        ]}
        request={(params, sorter, filter) => queryPermission()}//请求数据
        columns={columns}    //上面定义的
        rowSelection={{checkStrictly: false}}
        //pagination={false}
      />
      <CreateForm onCancel={() => setCreateModalVisible(false)}
                  onCreate={onCreate} modalVisible={createModalVisible} createFormValues={createFormValues}>
      </CreateForm>
      <UpdateForm onCancel={() => setUpdateModalVisible(false)}
                  onUpdate={onUpdate} modalVisible={updateModalVisible} updateFormValues={updateFormValues}>
      </UpdateForm>
    </PageHeaderWrapper>
  );
};

export default PermissionList;

