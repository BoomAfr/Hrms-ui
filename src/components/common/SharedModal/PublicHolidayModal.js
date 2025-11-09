import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Card, Select, DatePicker } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const PublicHolidayModal = ({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  editingPublicHoliday, // { id, holiday, start_date, end_date, comment }
  title = 'Add Public Holiday',
  holidaysOptions = [], // list from manageHoliday: [{id, name}, ...]
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingPublicHoliday) {
      // Prepare initial values
      const initial = {
        holiday: editingPublicHoliday.holiday && typeof editingPublicHoliday.holiday === 'object'
          ? editingPublicHoliday.holiday.id
          : editingPublicHoliday.holiday ?? editingPublicHoliday.holiday_id ?? null,
        comment: editingPublicHoliday.comment ?? '',
      };

      // parse dates if present
      if (editingPublicHoliday.start_date) {
        initial.start_date = dayjs(editingPublicHoliday.start_date);
      }
      if (editingPublicHoliday.end_date) {
        initial.end_date = dayjs(editingPublicHoliday.end_date);
      }

      form.setFieldsValue(initial);
    } else {
      form.resetFields();
    }
  }, [editingPublicHoliday, form]);

  const handleSubmit = (values) => {
    // values: { holiday: id, start_date: Dayjs, end_date: Dayjs, comment }
    const payload = {
      holiday: values.holiday,
      start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
      end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
      comment: values.comment ?? '',
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
      title={title}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
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
          {/* Holiday Name dropdown */}
          <Form.Item
            label="Holiday Name"
            name="holiday"
            rules={[{ required: true, message: 'Please select holiday!' }]}
          >
            <Select
              showSearch
              placeholder="Select holiday"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
              size="large"
              style={{ borderRadius: '6px' }}
            >
              {holidaysOptions.map((h) => (
                <Option key={h.id} value={h.id}>
                  {h.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Start Date */}
          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[{ required: true, message: 'Please select start date!' }]}
          >
            <DatePicker
              style={{ width: '100%', borderRadius: '6px' }}
              size="large"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          {/* End Date */}
          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: 'Please select end date!' }]}
          >
            <DatePicker
              style={{ width: '100%', borderRadius: '6px' }}
              size="large"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          {/* Comment */}
          <Form.Item
            label="Comment"
            name="comment"
            rules={[]}
          >
            <TextArea
              placeholder="Enter comments (optional)"
              rows={4}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
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

export default PublicHolidayModal;
