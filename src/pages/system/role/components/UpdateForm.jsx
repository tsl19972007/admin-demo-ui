import React, {useEffect, useState} from 'react';
import {Form, Input, Modal, TreeSelect, DatePicker} from 'antd';
import moment from 'moment';
import {queryPermission, getTreeData} from "@/services/permission";

const UpdateForm = props => {
  const {modalVisible, onCancel, onUpdate, updateFormValues} = props;
  const [treeData, setTreeData] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: updateFormValues.id,
      name: updateFormValues.name,
      desc: updateFormValues.desc,
      createBy: updateFormValues.createBy,
      createTime: moment(updateFormValues.createTime, 'YYYY-MM-DD HH:mm:ss'),
      permissions: updateFormValues.permissions ? updateFormValues.permissions.map(role => {
        return {value: role.id, label: role.desc};
      }) : null
    });
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
      title="修改角色"
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
          label="角色名"
          rules={[{required: true, message: '请输入角色名！'}]}
        >
          <Input placeholder="请输入" disabled/>
        </Form.Item>
        <Form.Item
          name="desc"
          label="角色描述"
          rules={[{required: true, message: '请输入角色描述！'}]}
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

export default UpdateForm;
