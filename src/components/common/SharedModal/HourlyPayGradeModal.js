import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const HourlyPaygradeModal = ({
  isModalOpen,
  setIsModalOpen,
  onSubmit,           
  editingPaygrade,    
  title = 'Add Hourly Paygrade',
}) => {
  const [form] = Form.useForm();

  const [saving,setSaving] = useState(false);

  useEffect(() => {
    if (editingPaygrade) {
      form.setFieldsValue({
        pay_grade_name: editingPaygrade.pay_grade_name ?? '',
        hourly_rate: editingPaygrade.hourly_rate ?? '',
      });
    } else {
      form.resetFields();
    }
  }, [editingPaygrade, form]);

  const handleFinish = async (values) => {
    const payload = {
      pay_grade_name: values.pay_grade_name,
      hourly_rate: values.hourly_rate === '' || values.hourly_rate === undefined
        ? null
        : Number(values.hourly_rate),
    };
   try{
    setSaving(true);
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
      title={title}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <Card size="small" bodyStyle={{ padding: 24 }}>
        <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
          <Form.Item
            label="Pay Grade Name"
            name="pay_grade_name"
            rules={[
              { required: true, message: 'Please enter pay grade name!' },
              { min: 2, message: 'Name must be at least 2 characters!' },
            ]}
          >
            <Input placeholder="Enter pay grade name" size="large" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            label="Hourly Rate"
            name="hourly_rate"
            rules={[
              { required: true, message: 'Please enter hourly rate!' },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error('Please enter hourly rate'));
                  }
                  const num = Number(value);
                  if (Number.isNaN(num) || num < 0) {
                    return Promise.reject(new Error('Hourly rate must be a non-negative number'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" placeholder="Enter hourly rate" size="large" min={0} step="0.01" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button size="large" onClick={handleCancel} style={{ minWidth: 100, borderRadius: 6 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" style={{ minWidth: 120, borderRadius: 6 }} loading={saving}>
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default HourlyPaygradeModal;