import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

const { Option } = Select;

const DeductionModal = ({ open, onClose, onSubmit, initialValues = null, submitting = false }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        deduction_name: initialValues.deduction_name,
        deduction_type: initialValues.deduction_type,
        percentage_of_basic: initialValues.percentage_of_basic != null ? Number(initialValues.percentage_of_basic) : undefined,
        limit_per_month: initialValues.limit_per_month != null ? Number(initialValues.limit_per_month) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // ensure numeric fields are numbers
      const payload = {
        ...values,
        percentage_of_basic: values.percentage_of_basic != null ? Number(values.percentage_of_basic) : 0,
        limit_per_month: values.limit_per_month != null ? Number(values.limit_per_month) : 0,
      };
      await onSubmit(payload);
      form.resetFields();
    } catch (err) {
      // validation errors handled by form
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Deduction" : "Add New Deduction"}
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
          name="deduction_name"
          label="Deduction Name"
          rules={[{ required: true, message: "Please enter deduction name" }]}
        >
          <Input placeholder="Deduction Name" />
        </Form.Item>

        <Form.Item
          name="deduction_type"
          label="Deduction Type"
          rules={[{ required: true, message: "Please select deduction type" }]}
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

export default DeductionModal;
