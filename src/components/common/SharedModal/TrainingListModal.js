import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Card } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { trainingTypeAPI, employeeAPI } from '../../../services/trainingListServices';
import moment from 'moment';

const { Option } = Select;

const TrainingListModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingTraining }) => {
  const [form] = Form.useForm();
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [saving,setSaving] = useState(false);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [tRes, eRes] = await Promise.all([trainingTypeAPI.getAll(), employeeAPI.getAll()]);
        setTrainingTypes(Array.isArray(tRes.data) ? tRes.data : (tRes.data.results || []));
        setEmployees(Array.isArray(eRes.data) ? eRes.data : (eRes.data.results || []));
      } catch (err) {
        console.error('lookup fetch error', err);
      }
    };
    fetchLookups();
  }, []);

  useEffect(() => {
    if (editingTraining) {
      
      const initial = {
        training_type:
          editingTraining.training_type?.id ??
          editingTraining.training_type ??
          editingTraining.training_type_id ??
          null,
        employee:
          editingTraining.employee?.id ?? editingTraining.employee ?? editingTraining.employee_id ?? null,
        subject: editingTraining.subject ?? '',
        from_date: editingTraining.from_date ? moment(editingTraining.from_date) : null,
        to_date: editingTraining.to_date ? moment(editingTraining.to_date) : null,
        description: editingTraining.description ?? '',
      };
      form.setFieldsValue(initial);
    } else {
      form.resetFields();
    }
  }, [editingTraining, form]);

  const handleFinish = async (values) => {
    const payload = {
      training_type: values.training_type,
      employee: values.employee,
      subject: values.subject,
      from_date: values.from_date ? values.from_date.format('YYYY-MM-DD') : null,
      to_date: values.to_date ? values.to_date.format('YYYY-MM-DD') : null,
      description: values.description,
    };
  try{
    setSaving(true);
    await onSubmit(payload);
    form.resetFields();
    setIsModalOpen(false);
  }
  finally{
    setSaving(false);
  }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={editingTraining ? 'Edit Employee Training' : 'Add Employee Training'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
    >
      <Card size="small" style={{ borderTop: '1px solid #d9d9d9', borderRadius: 8 }}>
        <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
          <Form.Item
            label="Training Type"
            name="training_type"
            rules={[{ required: true, message: 'Please select training type' }]}
          >
            <Select placeholder="Select training type" showSearch optionFilterProp="children">
              {trainingTypes.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.training_type_name ?? t.name ?? t.title ?? `#${t.id}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Employee Name"
            name="employee"
            rules={[{ required: true, message: 'Please select employee' }]}
          >
            <Select placeholder="Select employee" showSearch optionFilterProp="children">
              {employees.map((e) => (
                <Option key={e.id} value={e.id}>
                  {e.name ?? e.full_name ?? `${e.first_name ?? ''} ${e.last_name ?? ''}`.trim() ?? `#${e.id}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Subject" name="subject" rules={[{ required: true, message: 'Please enter subject' }]}>
            <Input placeholder="Enter subject" />
          </Form.Item>

          <Form.Item label="From Date" name="from_date" rules={[{ required: true, message: 'Please select from date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="To Date" name="to_date" rules={[{ required: true, message: 'Please select to date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={saving}>Save</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default TrainingListModal;

