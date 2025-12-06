import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

const { Option } = Select;

const BonusSettingModal = ({ open, onCancel, onSubmit, editingRecord, confirmLoading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue(editingRecord);
    } else {
      form.resetFields();
    }
  }, [editingRecord, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (err) {}
  };

  return (
    <Modal
      title={editingRecord ? "Edit Bonus" : "Add New Bonus"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={editingRecord ? "Update" : "Create"}
      confirmLoading={confirmLoading}   // 👈 added
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Festival Name"
          name="festival_name"
          rules={[{ required: true, message: "Festival name is required" }]}
        >
          <Input placeholder="Enter festival name" />
        </Form.Item>

        <Form.Item
          label="Bonus Based On"
          name="bonus_based_on"
          rules={[{ required: true, message: "Select bonus type" }]}
        >
          <Select placeholder="Select">
            <Option value="Basic">Basic</Option>
            <Option value="Gross">Gross</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Percentage of Bonus"
          name="percentage_of_basic"
          rules={[{ required: true, message: "Enter percentage" }]}
        >
          <InputNumber
            min={1}
            max={100}
            style={{ width: "100%" }}
            placeholder="Enter percentage"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BonusSettingModal;