import React, {useEffect} from 'react';
import {Form, Input, Modal, Select, DatePicker} from 'antd';
import moment from 'moment';

const {Option} = Select;

const UpdateForm = props => {
  const {modalVisible, onCancel, onUpdate, updateFormValues} = props;
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: updateFormValues.id,
      name: updateFormValues.name,
      desc: updateFormValues.desc,
      createBy: updateFormValues.createBy,
      createTime: moment(updateFormValues.createTime, 'YYYY-MM-DD HH:mm:ss'),
      type: updateFormValues.type + ''//转字符串否则无法填充select内容
    });
  });

  return (
    <Modal
      destroyOnClose={true}
      title="修改权限"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={async () => {
        const values = await form.validateFields();
        await onUpdate(values);
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
          name="id"
          style={{display: 'none'}}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="name"
          label="权限名称"
          rules={[{required: true, message: '请输入权限名称！'}]}
        >
          <Input placeholder="请输入" disabled/>
        </Form.Item>
        <Form.Item
          name="desc"
          label="权限描述"
          rules={[{required: true, message: '请输入权限描述！'}]}
        >
          <Input placeholder="请输入"/>
        </Form.Item>
        <Form.Item
          name="createBy"
          label="创建人"
          rules={[{required: true}]}
        >
          <Input disabled/>
        </Form.Item>
        <Form.Item
          name="createTime"
          label="创建时间"
          rules={[{required: true}]}
        >
          <DatePicker showTime disabled/>
        </Form.Item>
        <Form.Item
          name="type"
          label="权限类型"
          rules={[{required: true, message: '请选择权限类型！'}]}
        >
          <Select placeholder="请选择" disabled>
            <Option value="1">菜单</Option>
            <Option value="2">按钮</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
