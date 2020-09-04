import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Select} from 'antd';
import {queryAllRole} from "@/services/role";

const {Option} = Select;

const CreateForm = props => {
  const {modalVisible, onCancel, onCreate} = props;
  const [selectData, setSelectData] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
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
      title="新建用户"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={async () => {
        const values = await form.validateFields();
        await onCreate(values);
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
          name="username"
          label="用户名"
          rules={[{required: true, message: '请输入用户名！'}]}
        >
          <Input placeholder="请输入"/>
        </Form.Item>
        <Form.Item
          name="name"
          label="姓名"
          rules={[{required: true, message: '请输入姓名！'}]}
        >
          <Input placeholder="请输入"/>
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

export default CreateForm;
