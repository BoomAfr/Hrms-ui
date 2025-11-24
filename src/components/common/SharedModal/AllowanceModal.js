import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

const { Option } = Select;

const AllowanceModal = ({ open, onClose, onSubmit, initialValues = null, submitting = false }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        allowance_name: initialValues.allowance_name,
        allowance_type: initialValues.allowance_type,
        percentage_of_basic: initialValues.percentage_of_basic ? Number(initialValues.percentage_of_basic) : undefined,
        limit_per_month: initialValues.limit_per_month ? Number(initialValues.limit_per_month) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (err) {}
  };

  return (
    <Modal
      title={initialValues ? "Edit Allowance" : "Add New Allowance"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okButtonProps={{ loading: submitting }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="allowance_name"
          label="Allowance Name"
          rules={[{ required: true, message: "Please enter allowance name" }]}
        >
          <Input placeholder="Allowance Name" />
        </Form.Item>

        <Form.Item
          name="allowance_type"
          label="Allowance Type"
          rules={[{ required: true, message: "Please select allowance type" }]}
        >
          <Select placeholder="Select type">
            <Option value="Percentage">Percentage</Option>
            <Option value="Fixed">Fixed</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="percentage_of_basic"
          label="Percentage of Basic"
          rules={[
            { required: true, message: "Please enter percentage or fixed value" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") return Promise.reject();
                if (isNaN(value)) return Promise.reject("Must be a number");
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber min={0} max={1000000000} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="limit_per_month"
          label="Limit Per Month"
          rules={[{ required: true, message: "Please enter limit per month" }]}
        >
          <InputNumber min={0} max={1000000000} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AllowanceModal;
