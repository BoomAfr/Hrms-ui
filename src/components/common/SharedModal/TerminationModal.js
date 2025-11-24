import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
const { TextArea } = Input;

const TerminationModal = ({ open, onClose, onSubmit, employees, editingData, loading, submitLoading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingData) {
      form.setFieldsValue({
        terminate_to: editingData.terminate_to?.id ?? undefined,
        terminate_by: editingData.terminate_by?.id ?? undefined,
        termination_type: editingData.termination_type ?? '',
        subject: editingData.subject ?? '',
        notice_date: editingData.notice_date ? moment(editingData.notice_date) : null,
        termination_date: editingData.termination_date ? moment(editingData.termination_date) : null,
        description: editingData.description ?? '',
      });
    } else {
      form.resetFields();
    }
  }, [editingData, form]);

  const handleFinish = (values) => {
     console.log('Form values:', values);
  const payload = {
    terminate_to: Number(values.terminate_to),
    terminate_by: Number(values.terminate_by),
    termination_type: values.termination_type,
    subject: values.subject,
    notice_date: values.notice_date.format('YYYY-MM-DD'),
    termination_date: values.termination_date.format('YYYY-MM-DD'),
    description: values.description,
  };
  console.log('Payload:', payload);
  onSubmit(payload);
  };

  return (
    <Modal
      title={editingData ? 'Edit Termination' : 'Add Termination'}
      open={open}
      onCancel={onClose}
      okText="Submit"
      confirmLoading={submitLoading}
      onOk={() => form.submit()}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
  name="terminate_to"
  label="Employee Name*"
  rules={[{ required: true, message: 'Please select employee' }]}
>
  <Select placeholder="Select Employee" showSearch optionFilterProp="children" allowClear>
    {employees.map(emp => {
      const id = emp.id || emp.user_id;   // FIXED ID
      const fullName =
        emp.name ||
        emp.full_name ||
        emp.profile?.full_name ||
        emp.first_name + " " + emp.last_name ||
        "Unknown";

      return (
        <Select.Option key={id} value={id}>
          {fullName}
        </Select.Option>
      );
    })}
  </Select>
</Form.Item>

<Form.Item
  name="terminate_by"
  label="Terminated By*"
  rules={[{ required: true, message: 'Please select employee' }]}
>
  <Select placeholder="Select Terminated By" showSearch optionFilterProp="children" allowClear>
    {employees.map(emp => {
      const id = emp.id || emp.user_id;   // FIXED ID
      const fullName =
        emp.name ||
        emp.full_name ||
        emp.profile?.full_name ||
        emp.first_name + " " + emp.last_name ||
        "Unknown";

      return (
        <Select.Option key={id} value={id}>
          {fullName}
        </Select.Option>
      );
    })}
  </Select>
</Form.Item>

        <Form.Item
          name="termination_type"
          label="Termination Type*"
          rules={[{ required: true, message: 'Please input termination type' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="subject"
          label="Subject*"
          rules={[{ required: true, message: 'Please input subject' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="notice_date"
          label="Notice Date*"
          rules={[{ required: true, message: 'Please select notice date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="termination_date"
          label="Termination Date*"
          rules={[{ required: true, message: 'Please select termination date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TerminationModal;