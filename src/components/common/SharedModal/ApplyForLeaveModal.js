
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, DatePicker, Input, message } from "antd";
import dayjs from "dayjs";
import { getLeaveTypes, getLeaveBalance, applyForLeave } from "../../../services/applyForLeaveServices";

const ApplyForLeaveModal = ({ isModalOpen, setIsModalOpen, onSuccess }) => {
  const [form] = Form.useForm();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [daysCount, setDaysCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch leave types on load
  useEffect(() => {
    const loadLeaveTypes = async () => {
      try {
        const res = await getLeaveTypes();
        const list = Array.isArray(res)
        ? res
        : res?.results || res?.data || [];
      setLeaveTypes(list);
      } catch (err) {
        message.error("Failed to load leave types");
      }
    };
    loadLeaveTypes();
  }, []);

  // ✅ Fetch balance when leave type selected
  const handleLeaveTypeChange = async (value) => {
    form.setFieldValue("leave_type", value);
    try {
      const res = await getLeaveBalance(value);
      setCurrentBalance(res?.balance ?? 0);
    } catch {
      setCurrentBalance(null);
    }
  };

  // ✅ Calculate number of days automatically
  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const diff = dayjs(dates[1]).diff(dayjs(dates[0]), "day") + 1;
      setDaysCount(diff);
    } else {
      setDaysCount(0);
    }
  };

  // ✅ Submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        leave_type: values.leave_type,
        from_date: values.date_range[0].format("YYYY-MM-DD"),
        to_date: values.date_range[1].format("YYYY-MM-DD"),
        number_of_days: daysCount,
        purpose: values.purpose,
      };

      setLoading(true);
      await applyForLeave(payload);
      message.success("Leave applied successfully");
      setIsModalOpen(false);
      form.resetFields();
      onSuccess?.();
    } catch (err) {
      if (err?.errorFields) return; // form validation
      message.error("Failed to apply for leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Apply For Leave"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={handleSubmit}
      okText="Submit"
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {/* ✅ Leave Type */}
        <Form.Item
          name="leave_type"
          label="Leave Type"
          rules={[{ required: true, message: "Please select leave type" }]}
        >
          <Select
            placeholder="Select Leave Type"
            onChange={handleLeaveTypeChange}
            options={leaveTypes.map((lt) => ({
              label: lt.name,
              value: lt.id,
            }))}
          />
        </Form.Item>

        {/* ✅ Current Balance */}
        <Form.Item label="Current Balance">
          <Input value={currentBalance ?? "—"} disabled />
        </Form.Item>

        {/* ✅ Date Range */}
        <Form.Item
          name="date_range"
          label="Date Range"
          rules={[{ required: true, message: "Please select date range" }]}
        >
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            onChange={handleDateChange}
          />
        </Form.Item>

        {/* ✅ Number of Days */}
        <Form.Item label="Number of Days">
          <Input value={daysCount} disabled />
        </Form.Item>

        {/* ✅ Purpose */}
        <Form.Item
          name="purpose"
          label="Purpose / Reason"
          rules={[{ required: true, message: "Please enter purpose" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter your leave reason" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApplyForLeaveModal;