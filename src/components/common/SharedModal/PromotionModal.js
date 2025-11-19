import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const PromotionModal = ({ open, onClose, onSubmit, employees, departments, designations, paygrades, editingData, loading }) => {
  const [form] = Form.useForm();
  const [currentInfo, setCurrentInfo] = useState({ department: '', designation: '', pay_grade: '', salary: '' });

  // Set editing data
  useEffect(() => {
    if (editingData) {
      form.setFieldsValue({
        employee: editingData.employee?.id,
        promoted_department: editingData.promoted_department?.id,
        promoted_designation: editingData.promoted_designation?.id,
        promoted_pay_grade: editingData.promoted_pay_grade?.id,
        promotion_date: editingData.promotion_date ? moment(editingData.promotion_date) : null,
        description: editingData.description || '',
      });

      setCurrentInfo({
        department: editingData.previous_department?.name || '',
        designation: editingData.previous_designation?.name || '',
        pay_grade: editingData.previous_pay_grade?.name || '',
        salary: editingData.previous_salary || '',
      });
    } else {
      form.resetFields();
      setCurrentInfo({ department: '', designation: '', pay_grade: '', salary: '' });
    }
  }, [editingData, form]);

  // Fetch current employee info on employee select
  const handleEmployeeChange = (id) => {
    const selectedEmp = employees.find((e) => e.id === id);
    if (selectedEmp) {
      setCurrentInfo({
        department: selectedEmp.department?.name || '',
        designation: selectedEmp.designation?.name || '',
        pay_grade: selectedEmp.pay_grade?.name || '',
        salary: selectedEmp.salary || '',
      });
    }
  };

  // Fetch salary based on pay grade
  const handlePayGradeChange = (id) => {
    const selectedGrade = paygrades.find((p) => p.id === id);
    if (selectedGrade) {
      form.setFieldsValue({ new_salary: selectedGrade.salary });
    }
  };

  const handleFinish = (values) => {
    const payload = {
      employee: Number(values.employee),
      promoted_department: Number(values.promoted_department),
      promoted_designation: Number(values.promoted_designation),
      promoted_pay_grade: Number(values.promoted_pay_grade),
      promotion_date: values.promotion_date.format('YYYY-MM-DD'),
      description: values.description,
    };
    onSubmit(payload);
  };

  return (
    <Modal
      title={editingData ? 'Edit Promotion' : 'Add Promotion'}
      open={open}
      onCancel={onClose}
      okText="Submit"
      confirmLoading={loading}
      onOk={() => form.submit()}
      width={650}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
       <Form.Item name="employee" label="Employee Name*" rules={[{ required: true }]}>
  <Select
    placeholder="Select Employee"
    showSearch
    optionFilterProp="children"
    onChange={handleEmployeeChange}
  >
    {employees.map((emp) => (
      <Option key={emp.id} value={emp.id}>
        {emp.profile?.full_name || emp.username || 'Unknown'}
      </Option>
    ))}
  </Select>
</Form.Item>

        <Form.Item label="Current Department">
          <Input value={currentInfo.department} disabled />
        </Form.Item>

        <Form.Item label="Current Designation">
          <Input value={currentInfo.designation} disabled />
        </Form.Item>

        <Form.Item label="Current Pay Grade">
          <Input value={currentInfo.pay_grade} disabled />
        </Form.Item>

        <Form.Item label="Current Salary">
          <Input value={currentInfo.salary} disabled />
        </Form.Item>

        <Form.Item name="promoted_department" label="Promoted Department*" rules={[{ required: true }]}>
          <Select placeholder="Select Department">
            {departments.map((d) => (
              <Option key={d.id} value={d.id}>{d.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="promoted_designation" label="Promoted Designation*" rules={[{ required: true }]}>
          <Select placeholder="Select Designation">
            {designations.map((d) => (
              <Option key={d.id} value={d.id}>{d.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="promoted_pay_grade" label="Promoted Pay Grade*" rules={[{ required: true }]}>
          <Select placeholder="Select Pay Grade" onChange={handlePayGradeChange}>
            {paygrades.map((p) => (
              <Option key={p.id} value={p.id}>{p.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="New Salary">
          <Input name="new_salary" disabled />
        </Form.Item>

        <Form.Item name="promotion_date" label="Promotion Date*" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PromotionModal;
