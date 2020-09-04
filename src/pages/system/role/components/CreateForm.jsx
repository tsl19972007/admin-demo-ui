import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, TreeSelect} from 'antd';
import {getTreeData, queryPermission} from "@/services/permission";

const CreateForm = props => {
  const {modalVisible, onCancel, onCreate} = props;
  const [treeData, setTreeData] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  });

  useEffect(() => {
    (async () => {
      const res = await queryPermission();
      setTreeData(getTreeData(res.data));
    })();
  }, []);

  return (
    <Modal
      destroyOnClose
      title="新建角色"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={async () => {
        const values = await form.validateFields();
        await onCreate(values);
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{span: 6}}
        wrapperCol={{span: 15}}
        name="form_in_modal"
      >
        <Form.Item
          name="name"
          label="角色名"
          rules={[{required: true, message: '请输入角色名！'}]}
        >
          <Input placeholder="请输入"/>
        </Form.Item>
        <Form.Item
          name="desc"
          label="角色描述"
          rules={[{required: true, message: '请输入角色描述！'}]}
        >
          <Input placeholder="请输入"/>
        </Form.Item>
        <Form.Item
          name="permissions"
          label="角色权限"
          rules={[{required: true, message: '请选择角色权限！', type: 'array'}]}
        >
          <TreeSelect
            treeData={treeData}
            treeCheckable={true}
            treeCheckStrictly={true}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            placeholder="请选择">
          </TreeSelect>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
