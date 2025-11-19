import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, Upload, Image } from "antd";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const NoticeModal = ({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  editingNotice,
  isViewMode = false,
}) => {
  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingNotice) {
      form.setFieldsValue({
        title: editingNotice.title,
        description: editingNotice.description,
        status: editingNotice.status,
        publish_date:
          editingNotice.publish_date && moment(editingNotice.publish_date, "YYYY-MM-DD", true).isValid()
            ? moment(editingNotice.publish_date, "YYYY-MM-DD")
            : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingNotice, form]);

  const handleFinish = async (values) => {
    setSaving(true);

  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("status", values.status);
  if (values.publish_date)
    formData.append("publish_date", values.publish_date.format("YYYY-MM-DD"));
  if (values.image && values.image.file) {
    formData.append("attach_file", values.image.file.originFileObj);
  }

  try {
    await onSubmit(formData);  // ⬅️ MUST be awaited
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
      title={
        isViewMode
          ? "View Notice"
          : editingNotice
          ? "Edit Notice"
          : "Add Notice"
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={
        !isViewMode && (
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" form="noticeForm" icon={<SaveOutlined />}loading={saving} disabled={saving}>
              Save
            </Button>
          </div>
        )
      }
      width={600}
      centered
    >
      {isViewMode ? (
        <div style={{ lineHeight: 1.8 }}>
          <h3>{editingNotice?.title}</h3>
          <p>{editingNotice?.description}</p>
          {editingNotice?.image && (
            <div style={{ marginTop: 15 }}>
              <Image
                src={editingNotice.image}
                alt="Notice"
                width={300}
                style={{ borderRadius: 10 }}
              />
            </div>
          )}
        </div>
      ) : (
        <Form
          id="noticeForm"
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title!" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="PUBLISHED">Published</Option>
              <Option value="UNPUBLISHED">Not Published</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Publish Date"
            name="publish_date"
            rules={[{ required: true, message: "Please select publish date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Attach File" name="attach_file">
            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          {editingNotice?.image && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <Image
                src={editingNotice.image}
                alt="Notice"
                width={150}
                style={{ borderRadius: 8 }}
              />
            </div>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default NoticeModal;