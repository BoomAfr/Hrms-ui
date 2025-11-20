import React, { useEffect,useState } from 'react';
import { Modal, Form, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const AddRoleModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingRole, title = 'Add Role', fieldLabel = 'Update Role', loading = false }) => {
  const [form] = Form.useForm();
  //const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingRole) {
      form.setFieldsValue({ name: editingRole.name });
    } else {
      form.resetFields();
    }
  }, [editingRole, form]);

  const handleSubmit = async (values) => {
   await onSubmit(values);
    form.resetFields();
    setIsModalOpen(false); 
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal title={title} open={isModalOpen} onCancel={handleCancel} footer={null} width={500} centered>
      <Card size="small" style={{ borderTop: '1px solid #d9d9d9', borderRadius: '8px', marginTop: '16px' }} bodyStyle={{ padding: '24px' }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          {Array.isArray(fieldLabel) && fieldLabel.map((field, idx) => (
            <Form.Item
              key={field.name || idx}
              label={field.label}
              name={field.name}
              rules={[
                { required: field.isRequired, message: `Please enter ${field.label.toLowerCase()}!` },
                { min: 2, message: `${field.label} must be at least 2 characters!` },
              ]}
            >
              {field.component}
            </Form.Item>
          ))}

          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button size="large" onClick={handleCancel} style={{ minWidth: '100px', borderRadius: '6px' }}>
                Cancel
              </Button>

              <Button loading={loading} type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" style={{ minWidth: '120px', borderRadius: '6px', backgroundColor: '#1890ff' }}>
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default AddRoleModal;