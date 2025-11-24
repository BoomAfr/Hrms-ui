import React from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

const { Option } = Select;

const BonusSettingModal = ({ open, onCancel, onSubmit, editingRecord }) => {
  const [form] = Form.useForm();

  // Set values while editing
  if (editingRecord) {
    form.setFieldsValue(editingRecord);
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (err) {}
  };

  return (
    <Modal
      title={editingRecord ? "Edit Bonus" : "Add New Bonus"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={editingRecord ? "Update" : "Create"}
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
          name="percentage"
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
