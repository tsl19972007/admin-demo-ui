import React, {useRef, useState} from 'react';
import {Button, Divider, Dropdown, Menu, message, Modal, Space, Tag} from 'antd';
import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table'
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {queryUser, createUser, updateUser, deleteUser} from "@/services/user";

const UserList = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef();

  const onQuery = async (params) => {
    const res = await queryUser(params);
    return res.data;
  };

  const onCreate = async values => {
    console.log('Received values of form: ', values);
    const toCr = (({name, username, roles}) => ({name, username, roleIds: roles}))(values);
    const hide = message.loading('正在新建');
    const res = await createUser(toCr);
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
    const toUpdate = (({id, name, roles}) => ({id, name, roleIds: roles}))(values);
    const hide = message.loading('正在更新');
    const res = await updateUser(toUpdate);
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
    const res = await deleteUser(idList);
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
      title: '确定删除用户吗？',
      onOk() {
        return onDelete(idList);
      },
    });
  };

  const columns = [
    {
      title: '用户名',    //表头显示的名称
      dataIndex: 'username', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
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
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '角色',
      dataIndex: 'roles',
      hideInSearch: true,
      render: (_, row) => (
        <Space>
          {row.roles.map(({id, name, desc}) => (
            <Tag key={id}>
              {desc}
            </Tag>
          ))}
        </Space>
      ),
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
          <a onClick={() => {
            showDeleteConfirm(Array.of(record.id));
          }}>删除</a>
        </>
      ),
    },
  ];

  return (<PageHeaderWrapper>
      <ProTable
        headerTitle="用户列表"    //表头
        actionRef={actionRef}    //用于触发刷新操作等，看api
        rowKey="id"                //表格行 key 的取值，可以是字符串或一个函数
        toolBarRender={(action, {selectedRowKeys}) => [
          <Button icon={<PlusOutlined/>} type="primary" onClick={() => setCreateModalVisible(true)}>
            新建
          </Button>,
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
        request={(params, sorter, filter) => onQuery(params)}//请求数据
        columns={columns}    //上面定义的
        rowSelection={{}}
        preserveSelectedRowKeys={false}
      />
      <CreateForm onCancel={() => setCreateModalVisible(false)} onCreate={onCreate} modalVisible={createModalVisible}>
      </CreateForm>
      <UpdateForm onCancel={() => {
        setUpdateModalVisible(false)
      }}
                  onUpdate={onUpdate} modalVisible={updateModalVisible} updateFormValues={updateFormValues}>
      </UpdateForm>
    </PageHeaderWrapper>
  );
};

export default UserList;
