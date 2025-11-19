import React, { useEffect,useState } from 'react';
import { Modal, Form, Input, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const CommonFormModal = ({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  editingDept,
  title = 'Add Branch',
  fieldLabel = [],
}) => {
  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (editingDept) {
      form.setFieldsValue({ name: editingDept.name });
    } else {
      form.resetFields();
    }
  }, [editingDept, form]);

  const handleSubmit = async (values) => {
      setSaving(true);
    try {
      await onSubmit(values); // waits for add/update to finish
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
          {Array.isArray(fieldLabel) &&
          fieldLabel?.map((field) =>(
             <Form.Item
            label={field.label}
            name={field.name}
            rules={[
              { required: field.isRequired, message: `Please enter ${field.label.toLowerCase()}!` },
              { min: 2, message: `${field} must be at least 2 characters!` },
            ]}
          >
            {/* <Input
              placeholder={`Enter ${field.toLowerCase()}`}
              size="large"
              style={{ borderRadius: '6px' }}
            /> */}
            {field.component}
          </Form.Item>
          ))
          }

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

export default CommonFormModal;