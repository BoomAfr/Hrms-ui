import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const WarningModal = ({
  open,
  onClose,
  onSubmit,
  employees,
  loading,
  editingData,
  viewMode,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingData) {
      form.setFieldsValue({
        warning_to: editingData.warning_to,
        warning_by: editingData.warning_by,
        warning_type: editingData.warning_type,
        subject: editingData.subject,
        description: editingData.description,
        warning_date: editingData.warning_date ? dayjs(editingData.warning_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingData]);

  return (
    <Modal
      title={viewMode ? "Warning Details" : editingData ? "Edit Warning" : "Add Warning"}
      open={open}
      onCancel={onClose}
      okText={viewMode ? "Close" : "Save"}
      onOk={() => {
        if (viewMode) return onClose();
        form.submit();
      }}
      confirmLoading={loading}
      centered
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item label="Employee Name" name="warning_to" rules={[{ required: !viewMode }]}>
          <Select disabled={viewMode} placeholder="Select employee">
            {employees.map((emp) => (
              <Option key={emp.user_id} value={emp.user_id}>
                {emp.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Warning By" name="warning_by" rules={[{ required: !viewMode }]}>
          <Select disabled={viewMode} placeholder="Select employee">
            {employees.map((emp) => (
              <Option key={emp.user_id} value={emp.user_id}>
                {emp.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Warning Type" name="warning_type" rules={[{ required: !viewMode }]}>
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item label="Subject" name="subject" rules={[{ required: !viewMode }]}>
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: !viewMode }]}>
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item label="Warning Date" name="warning_date" rules={[{ required: !viewMode }]}>
          <DatePicker disabled={viewMode} format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WarningModal;