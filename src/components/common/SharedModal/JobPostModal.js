import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const statusOptions = [
  { label: "Published", value: "PUBLISHED" },
  { label: "Unpublished", value: "UNPUBLISHED" },
];

const publishedByOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Super Admin", value: "Super Admin" },
];

const JobPostModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form] = Form.useForm();

  const [saving,setSaving] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        job_title: initialData.job_title,
        job_post: initialData.job_post,
        description: initialData.description,
        status: initialData.status,
        published_by: initialData.published_by,
        job_publish_date: initialData.job_publish_date
          ? dayjs(initialData.job_publish_date)
          : null,
        application_end_date: initialData.application_end_date
          ? dayjs(initialData.application_end_date)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        job_title: values.job_title,
        job_post: values.job_post,
        description: values.description,
        status: values.status,
        published_by: values.published_by,
        job_publish_date: values.job_publish_date
          ? dayjs(values.job_publish_date).format("YYYY-MM-DD")
          : null,
        application_end_date: values.application_end_date
          ? dayjs(values.application_end_date).format("YYYY-MM-DD")
          : null,
      };
      setSaving(true);
      await onSubmit(payload);
      onClose();
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
    finally{
      setSaving(false);
    }
  };

  return (
    <Modal
      title={initialData ? "Edit Job Post" : "Create Job Post"}
      open={open}
      onCancel={onClose}
      onOk={handleFinish}
      okText="Save"
      loading={saving}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="job_title"
          label="Job Title"
          rules={[{ required: true, message: "Enter job title" }]}
        >
          <Input placeholder="Enter job title" />
        </Form.Item>

        <Form.Item
          name="job_post"
          label="Job Post"
          rules={[{ required: true, message: "Enter job post" }]}
        >
          <Input placeholder="Enter job post" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="published_by"
          label="Published By"
          rules={[{ required: true, message: "Select publisher" }]}
        >
          <Select placeholder="Select publisher">
            {publishedByOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Select status" }]}
        >
          <Select placeholder="Select status">
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="job_publish_date" label="Publish Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="application_end_date"
          label="Application End Date"
          rules={[{ required: true, message: "Select end date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobPostModal;