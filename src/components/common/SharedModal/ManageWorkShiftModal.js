import React, { useEffect,useState } from "react";
import { Modal, Form, Input, Button, TimePicker, Card } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import moment from "moment";

const WorkShiftModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingShift }) => {
  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingShift) {
      form.setFieldsValue({
        shift_name: editingShift.shift_name,
        start_time: editingShift.start_time ? moment(editingShift.start_time, "HH:mm") : null,
        end_time: editingShift.end_time ? moment(editingShift.end_time, "HH:mm") : null,
        late_count_time: editingShift.late_count_time ? moment(editingShift.late_count_time, "HH:mm") : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingShift, form]);

  const handleFinish = async (values) => {
    const payload = {
      shift_name: values.shift_name,
      start_time: values.start_time ? values.start_time.format("HH:mm") : null,
      end_time: values.end_time ? values.end_time.format("HH:mm") : null,
      late_count_time: values.late_count_time ? values.late_count_time.format("HH:mm") : null,
    };
    try {
    setSaving(true)
    await onSubmit(payload);
    setIsModalOpen(false);
    form.resetFields();
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
      title={editingShift ? "Edit Work Shift" : "Add Work Shift"}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
    >
      <Card size="small" style={{ borderRadius: 8 }}>
        <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
          <Form.Item
            label="Work Shift Name"
            name="shift_name"
            rules={[{ required: true, message: "Please enter work shift name" }]}
          >
            <Input placeholder="Enter work shift name" />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[{ required: true, message: "Please select start time" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="end_time"
            rules={[{ required: true, message: "Please select end time" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Late Count Time"
            name="late_count_time"
            rules={[{ required: true, message: "Please select late count time" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}loading={saving}>
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default WorkShiftModal;