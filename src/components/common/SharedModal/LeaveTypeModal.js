import React, { useEffect,useState } from 'react';
import { Modal, Form, Input, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const LeaveTypeModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingLeaveType }) => {
  const [form] = Form.useForm();

  const [saving, setSaving]= useState(false);

  useEffect(() => {
    if (editingLeaveType) {
      form.setFieldsValue({
        name: editingLeaveType.name ?? undefined,
        number_of_days: editingLeaveType.number_of_days ?? undefined,
      });
    } else {
      form.resetFields();
    }
  }, [editingLeaveType, form]);

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      number_of_days: Number(values.number_of_days),
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
      title={editingLeaveType ? 'Edit Leave Type' : 'Add Leave Type'}
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
            label="Leave Type Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter leave type name!' },
              { min: 1, message: 'Please enter a valid leave type name' },
            ]}
          >
            <Input
              placeholder="Enter leave type name"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            label="Number of Days"
            name="number_of_days"
            rules={[
              { required: true, message: 'Please enter number of days!' },
              {
                pattern: /^\d+$/,
                message: 'Number of days must be a number',
              },
            ]}
          >
            <Input
              placeholder="Enter number of days"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button
                size="large"
                onClick={handleCancel}
                style={{ minWidth: '100px', borderRadius: '6px' }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                size="large"
                style={{
                  minWidth: '120px',
                  borderRadius: '6px',
                  backgroundColor: '#1890ff',
                }}
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

export default LeaveTypeModal;