/*import React, {useEffect} from 'react';
import { Modal, Form, Input, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const AddDepartmentModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingDept }) => {
  const [form] = Form.useForm();

  useEffect(() => {
   if (editingDept) {
      form.setFieldsValue({ name:editingDept.name });
    } else {
      form.resetFields();
    }
  }, [editingDept, form]);

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    //setIsModalOpen(false);
    onSubmit(values)
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Add Department"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <Card 
        size="small" 
        style={{ 
          borderTop: '1px solid #d9d9d9',
          borderRadius: '8px',
          marginTop: '16px'
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
            label={
              "Department Name"
            }
            name="name"
            rules={[
              { 
                required: true, 
                message: 'Please enter department name!' 
              },
              {
                min: 2,
                message: 'Department name must be at least 2 characters!'
              }
            ]}
          >
            <Input 
              placeholder="Enter department name"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <Button 
                size="large"
                onClick={handleCancel}
                style={{ 
                  minWidth: '100px',
                  borderRadius: '6px'
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                style={{ 
                  minWidth: '120px',
                  borderRadius: '6px',
                  backgroundColor: '#1890ff'
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

export default AddDepartmentModal;*/
// src/components/SharedModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const AddDepartmentModal = ({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  editingDept,
  title = 'Add Department',
  fieldLabel = 'Department Name',
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingDept) {
      form.setFieldsValue({ name: editingDept.name });
    } else {
      form.resetFields();
    }
  }, [editingDept, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
    form.resetFields();
    setIsModalOpen(false);
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
            label={fieldLabel}
            name="name"
            rules={[
              { required: true, message: `Please enter ${fieldLabel.toLowerCase()}!` },
              { min: 2, message: `${fieldLabel} must be at least 2 characters!` },
            ]}
          >
            <Input
              placeholder={`Enter ${fieldLabel.toLowerCase()}`}
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <Button
                size="large"
                onClick={handleCancel}
                style={{
                  minWidth: '100px',
                  borderRadius: '6px',
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
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

export default AddDepartmentModal;
