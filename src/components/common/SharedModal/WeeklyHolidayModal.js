import React, { useEffect } from 'react';
import { Modal, Form, Select, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const WeeklyHolidayModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingHoliday }) => {
  const [form] = Form.useForm();

  const weekDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const statusOptions = ['Active', 'Non Active'];

  useEffect(() => {
    if (editingHoliday) {
      form.setFieldsValue({
        name: editingHoliday.day,
        status: editingHoliday.is_active ? 'Active' : 'Non Active',
      });
    } else {
      form.resetFields();
    }
  }, [editingHoliday, form]);

  const handleSubmit = (values) => {
    // ✅ Send exactly what backend expects
    const payload = {
      day: values.name,
      is_active: values.status === 'Active' ? true : false, // ✅ boolean expected by backend
    };
    onSubmit(payload);
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={editingHoliday ? 'Edit Weekly Holiday' : 'Add Weekly Holiday'}
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
            label="Weekly Holiday Name"
            name="name"
            rules={[{ required: true, message: 'Please select a day!' }]}
          >
            <Select placeholder="Select a day" size="large">
              {weekDays.map((day) => (
                <Select.Option key={day} value={day}>
                  {day}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status" size="large">
              {statusOptions.map((opt) => (
                <Select.Option key={opt} value={opt}>
                  {opt}
                </Select.Option>
              ))}
            </Select>
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

export default WeeklyHolidayModal;
