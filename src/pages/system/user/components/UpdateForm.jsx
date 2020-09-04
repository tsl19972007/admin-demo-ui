import React, {useEffect, useState} from 'react';
import {Form, Input, Modal, Select, DatePicker} from 'antd';
import moment from 'moment';
import {queryAllRole} from "@/services/role";

const {Option} = Select;

const UpdateForm = props => {
  const {modalVisible, onCancel, onUpdate, updateFormValues} = props;
  const [selectData, setSelectData] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: updateFormValues.id,
      username: updateFormValues.username,
      name: updateFormValues.name,
      createBy: updateFormValues.createBy,
      createTime: moment(updateFormValues.createTime, 'YYYY-MM-DD HH:mm:ss'),
      roles: updateFormValues.roles ? updateFormValues.roles.map(role => role.id) : null
    });
  });

  useEffect(() => {
    (async () => {
      const res = await queryAllRole();
      setSelectData(res.data);
    })();
  }, []);

  return (
    <Modal
      destroyOnClose
      title="修改用户"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={async () => {
        const values = await form.validateFields();
        await onUpdate(values);
      }}
    >
      <Form
        form={form}
        labelCol={{span: 6}}
        wrapperCol={{span: 15}}
        layout="Vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="id"
          style={{display: 'none'}}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{required: true, message: '请输入用户名！'}]}
        >
          <Input placeholder="请输入" disabled/>
        </Form.Item>
        <Form.Item
          name="name"
          label="姓名"
          rules={[{required: true, message: '请输入姓名！'}]}
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
          name="roles"
          label="用户角色"
          rules={[{required: true, message: '请选择用户角色！', type: 'array'}]}
        >
          <Select mode="multiple" placeholder="请选择">
            {selectData && selectData.map(d => <Option key={d.id} value={d.id}>{d.desc}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
