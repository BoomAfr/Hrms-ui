import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, DatePicker, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const AwardModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingAward, employees = [] }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const awardOptions = [
    { label: 'Employee of the month', value: 'EMPLOYEE_OF_THE_MONTH' },
    { label: 'Employee of the year', value: 'EMPLOYEE_OF_THE_YEAR' },
    { label: 'Best Employee', value: 'BEST_EMPLOYEE' },
  ];

  useEffect(() => {
    if (editingAward) {
      form.setFieldsValue({
        award_name: editingAward.award_name,
        employee: Number(editingAward.employee),
        gift_item: editingAward.gift_item,
        award_month: editingAward.award_month ? dayjs(editingAward.award_month, 'YYYY-MM-DD') : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [editingAward, form]);

  const handleSubmit = async (values) => {
    const payload = {
      award_name: values.award_name,
      employee: values.employee,
      gift_item: values.gift_item,
      award_month: values.award_month ? values.award_month.startOf('month').format('YYYY-MM-DD') : null,
    };

    try {
      setSaving(true);
      await onSubmit(payload);
      form.resetFields();
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={editingAward ? 'Edit Award' : 'Add Award'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <Card size="small" style={{ borderTop: '1px solid #d9d9d9', borderRadius: '8px', marginTop: '12px' }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item name="award_name" label="Award Name" rules={[{ required: true, message: 'Please select award name!' }]}>
            <Select placeholder="Select award name" options={awardOptions} size="large" />
          </Form.Item>

          <Form.Item name="employee" label="Employee" rules={[{ required: true, message: 'Please select an employee!' }]}>
            <Select
              placeholder="Select employee"
              size="large"
              options={employees.map((emp) => ({ label: emp.name, value: emp.user_id }))}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>

          <Form.Item name="gift_item" label="Gift Item" rules={[{ required: true, message: 'Please enter gift item!' }]}>
            <Input placeholder="Enter gift item" size="large" />
          </Form.Item>

          <Form.Item name="award_month" label="Award Month" rules={[{ required: true, message: 'Please select award month!' }]}>
            <DatePicker picker="month" size="large" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} size="large">Save</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default AwardModal;

