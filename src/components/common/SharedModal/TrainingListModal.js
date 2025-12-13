import React, { useEffect, useState } from "react";
import {Modal,Form,Input,Select,DatePicker,Button,Card,Upload,Checkbox,Tooltip,} from "antd";
import { SaveOutlined, InboxOutlined } from "@ant-design/icons";
import { trainingTypeAPI, employeeAPI } from "../../../services/trainingListServices";
import moment from "moment";

const { Option } = Select;
const { Dragger } = Upload;

const TrainingListModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingTraining }) => {
  const [form] = Form.useForm();
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  const [fileList, setFileList] = useState([]); 
  const [removeExisting, setRemoveExisting] = useState(false);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [tRes, eRes] = await Promise.all([trainingTypeAPI.getAll(), employeeAPI.getAll()]);
        setTrainingTypes(Array.isArray(tRes.data) ? tRes.data : tRes.data.results || []);
        setEmployees(Array.isArray(eRes.data) ? eRes.data : eRes.data.results || []);
      } catch (err) {
        console.error("lookup fetch error", err);
      }
    };
    fetchLookups();
  }, []);

  useEffect(() => {
    if (editingTraining) {
      const initial = {
        training_type:
          editingTraining.training_type?.id ?? editingTraining.training_type ?? editingTraining.training_type_id ?? null,
        employee:
          editingTraining.employee?.id ?? editingTraining.employee ?? editingTraining.employee_id ?? null,
        subject: editingTraining.subject ?? "",
        from_date: editingTraining.from_date ? moment(editingTraining.from_date) : null,
        to_date: editingTraining.to_date ? moment(editingTraining.to_date) : null,
        description: editingTraining.description ?? "",
      };
      form.setFieldsValue(initial);

      if (editingTraining.certificate_file) {
        setFileList([
          {
            uid: "-1",
            name: editingTraining.certificate_file.split("/").pop() || "certificate",
            status: "done",
            url: editingTraining.certificate_file,
            thumbUrl: editingTraining.certificate_file,
          },
        ]);
      } else {
        setFileList([]);
      }
      setRemoveExisting(false);
    } else {
      form.resetFields();
      setFileList([]);
      setRemoveExisting(false);
    }
  }, [editingTraining, form]);

  const normFile = (e) => {
    return e && e.fileList;
  };

  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append("training_type", values.training_type);
    formData.append("employee", values.employee);
    formData.append("subject", values.subject);
    formData.append("from_date", values.from_date ? values.from_date.format("YYYY-MM-DD") : "");
    formData.append("to_date", values.to_date ? values.to_date.format("YYYY-MM-DD") : "");
    formData.append("description", values.description || "");

    const newFiles = fileList.filter((f) => !f.url && f.originFileObj); 
    if (newFiles.length > 0) {
      formData.append("certificate_file", newFiles[0].originFileObj);
    } else if (removeExisting) {
      formData.append("certificate_file", "");
    }

    try {
      setSaving(true);
      await onSubmit(formData);
      form.resetFields();
      setFileList([]);
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
    setRemoveExisting(false);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".pdf,.jpg,.jpeg,.png",
    fileList,
    onRemove: (file) => {
      if (file.url) {
        setRemoveExisting(true);
        setFileList([]);
      } else {
        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      }
      return false
    },
    beforeUpload: (file) => {
      setFileList([{ uid: file.uid, name: file.name, status: "done", originFileObj: file }]);
      setRemoveExisting(false);
      return false;
    },
    onPreview: async (file) => {
      if (file.url) {
        window.open(file.url, "_blank");
        return;
      }
      const url = URL.createObjectURL(file.originFileObj);
      window.open(url, "_blank");
    },
  };

  return (
    <Modal
      title={editingTraining ? "Edit Employee Training" : "Add Employee Training"}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
    >
      <Card size="small" style={{ borderTop: "1px solid #d9d9d9", borderRadius: 8 }}>
        <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
          <Form.Item
            label="Training Type"
            name="training_type"
            rules={[{ required: true, message: "Please select training type" }]}
          >
            <Select placeholder="Select training type" showSearch optionFilterProp="children">
              {trainingTypes.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.training_type_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Employee Name"
            name="employee"
            rules={[{ required: true, message: "Please select employee" }]}
          >
            <Select placeholder="Select employee" showSearch optionFilterProp="children">
              {employees.map((e) => (
                <Option key={e.user_id} value={e.user_id}>
                  {e.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Subject" name="subject" rules={[{ required: true, message: "Please enter subject" }]}>
            <Input placeholder="Enter subject" />
          </Form.Item>

          <Form.Item
            label="From Date"
            name="from_date"
            rules={[{ required: true, message: "Please select from date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="To Date" name="to_date" rules={[{ required: true, message: "Please select to date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.Item label="Certificate (optional)">
            <Dragger {...uploadProps} style={{ padding: 12 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Supports single file. PDF / JPG / PNG. Max recommended size: 5MB</p>
            </Dragger>

            {fileList.length > 0 && fileList[0].url && (
              <div style={{ marginTop: 8 }}>
                <Checkbox checked={removeExisting} onChange={(e) => setRemoveExisting(e.target.checked)}>
                  Remove existing certificate
                </Checkbox>
                <Tooltip title="Preview existing certificate">
                  <a href={fileList[0].url} target="_blank" rel="noreferrer" style={{ marginLeft: 12 }}>
                    View current file
                  </a>
                </Tooltip>
              </div>
            )}
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Button onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={saving}
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

export default TrainingListModal;