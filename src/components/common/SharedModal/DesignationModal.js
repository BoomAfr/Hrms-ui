import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Card, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

const DesignationModal = ({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  editingDesignation,
  title = 'Add Designation',
  fieldLabel = 'Designation Name',
  departments = [], // [{id, name}, ...]
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingDesignation) {
      const initial = {
        name: editingDesignation.name ?? '',
      };

      if (editingDesignation.department !== undefined && editingDesignation.department !== null) {
        initial.department =
          typeof editingDesignation.department === 'object'
            ? editingDesignation.department.id
            : editingDesignation.department;
      } else if (editingDesignation.department_id !== undefined) {
        initial.department = editingDesignation.department_id;
      }

      form.setFieldsValue(initial);
    } else {
      form.resetFields();
    }
  }, [editingDesignation, form]);

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

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Please select department!' }]}
          >
            <Select
              showSearch
              placeholder="Select department"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
              size="large"
              style={{ borderRadius: '6px' }}
            >
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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

export default DesignationModal;
