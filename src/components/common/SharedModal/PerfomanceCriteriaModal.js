import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const PerformanceCriteriaModal = ({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  categories,
  editingCriteria,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingCriteria) {
      form.setFieldsValue({
        category: editingCriteria.category?.id,
        criteria_name: editingCriteria.criteria_name,
      });
    } else {
      form.resetFields();
    }
  }, [editingCriteria]);

  return (
    <Modal
      title={editingCriteria ? "Edit Performance Criteria" : "Add Performance Criteria"}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={() => form.submit()}
      okText="Save"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Category Name"
          name="category"
          rules={[{ required: true, message: "Select a category" }]}
        >
          <Select placeholder="Select Category">
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.category_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Criteria Name"
          name="criteria_name"
          rules={[{ required: true, message: "Enter criteria name" }]}
        >
          <Input placeholder="Enter criteria" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PerformanceCriteriaModal;
