import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const PerformanceCategoryModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingCategory }) => {
  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      form.setFieldsValue({
        name: editingCategory.name,
      });
    } else {
      form.resetFields();
    }
  }, [editingCategory, form]);

  const handleFinish = async (values) => {
  try{
    setSaving(true)
    await onSubmit(values);
    form.resetFields();
    setIsModalOpen(false);
  }
  finally{
    setSaving(false)
  }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={editingCategory ? 'Edit Performance Category' : 'Add Performance Category'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <Card size="small" style={{ borderTop: '1px solid #d9d9d9', borderRadius: 8, marginTop: 12 }}>
        <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
          <Form.Item
            label="Performance Category"
            name="category_name"
            rules={[{ required: true, message: 'Please enter performance category!' }]}
          >
            <Input placeholder="Enter performance category" size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large"loading={saving}>Save</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default PerformanceCategoryModal;