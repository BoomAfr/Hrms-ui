import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, DatePicker, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEmployees } from '../../../hooks/useAward';

const AwardModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingAward, employees= [] }) => {
  const [form] = Form.useForm();
  const { employ = [] } = useEmployees() || {};

  const [saving, setSaving] = useState(false);

  const awardOptions = [
    { label: 'Employee of the month', value: 'Employee of the month' },
    { label: 'Employee of the year', value: 'Employee of the year' },
    { label: 'Best Employee', value: 'Best Employee' },
  ];

  useEffect(() => {
    if (editingAward) {
      form.setFieldsValue({
        award_name: editingAward.award_name,
        employee: editingAward.employee,
        gift_item: editingAward.gift_item,
        award_month: editingAward.award_month
          ? dayjs(editingAward.award_month, 'YYYY-MM')
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [editingAward, form]);

  const handleSubmit = async (values) => {
    const payload = {
      award_name: values.award_name,
      employee: values.employee, // employee ID, not name
      gift_item: values.gift_item,
      award_month: values.award_month
        ? values.award_month.format('YYYY-MM')
        : null,
    };
  try{
    setSaving(true)
    await onSubmit(payload);
    form.resetFields();
    setIsModalOpen(false);
  }
  finally{
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
      destroyOnHidden
    >
      <Card
        size="small"
        style={{
          borderTop: '1px solid #d9d9d9',
          borderRadius: '8px',
          marginTop: '16px',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Award Name"
            name="award_name"
            rules={[{ required: true, message: 'Please select award name!' }]}
          >
            <Select
              placeholder="Select award name"
              options={awardOptions}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Employee"
            name="employee"
            rules={[{ required: true, message: 'Please select an employee!' }]}
          >
            <Select
              placeholder="Select employee"
              size="large"
              options={employ.map((emp) => ({
                label: emp.name,
                value: emp.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Gift Item"
            name="gift_item"
            rules={[{ required: true, message: 'Please enter gift item!' }]}
          >
            <Input placeholder="Enter gift item" size="large" />
          </Form.Item>

          <Form.Item
            label="Award Month"
            name="award_month"
            rules={[{ required: true, message: 'Please select award month!' }]}
          >
            <DatePicker picker="month" size="large" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <Button onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                size="large"
              >
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default AwardModal;

