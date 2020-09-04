import React, {useEffect} from 'react';
import {Modal, Form, Input, Select} from 'antd';

const {Option} = Select;

const CreateForm = props => {
  const {modalVisible, onCancel, onCreate, createFormValues} = props;
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      parentNode: createFormValues.parentNode,
      parentId: createFormValues.parentId
    });
  });

  return (
    <Modal
      destroyOnClose
      title="新建权限"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={async () => {
        const values = await form.validateFields();
        await onCreate(values);
      }}
    >
      <Form
        form={form}
        layout="Vertical"
        labelCol={{span: 6}}
        wrapperCol={{span: 15}}
        name="form_in_modal"
      >
        <Form.Item
          name="parentId"
          style={{display: 'none'}}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="parentNode"
          label="上级节点"
        >
          <Input placeholder="请输入" disabled/>
        </Form.Item>
        <Form.Item
          name="name"
          label="权限名称"
          rules={[{required: true, message: '请输入权限名称！'}]}
        >
          <Input placeholder="请输入"/>
        </Form.Item>
        <Form.Item
          name="desc"
          label="权限描述"
          rules={[{required: true, message: '请输入权限描述！'}]}
        >
          <Input placeholder="请输入"/>
        </Form.Item>
        <Form.Item
          name="type"
          label="权限类型"
          rules={[{required: true, message: '请选择权限类型！'}]}
        >
          <Select placeholder="请选择">
            <Option value="1">菜单</Option>
            <Option value="2">按钮</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
