import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const PromotionModal = ({ open, onClose, onSubmit, employees = [], departments = [], designations = [], paygrades = [], loading,saveLoading, editingData, viewMode }) => {
  const [form] = Form.useForm();
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [currentPaygrade, setCurrentPaygrade] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [newSalary, setNewSalary] = useState('');

  // populate when editingData changes
  useEffect(() => {
    if (editingData) {
      form.setFieldsValue({
        employee: editingData.employee?.id ?? undefined,
        promoted_department: editingData.promoted_department?.id ?? undefined,
        promoted_designation: editingData.promoted_designation?.id ?? undefined,
        promoted_pay_grade: editingData.promoted_pay_grade?.id ?? undefined,
        promoted_salary: editingData.promoted_salary ?? editingData.new_salary ?? undefined,
        promotion_date: editingData.promotion_date ? dayjs(editingData.promotion_date) : null,
        description: editingData.description ?? '',
      });

      // try to set current employee info from editingData.employee object
      const emp = editingData.employee;
      setCurrentDepartment(emp?.department?.name ?? emp?.profile?.department_name ?? '');
      setCurrentDesignation(emp?.designation?.name ?? emp?.profile?.designation_name ?? '');
      setCurrentPaygrade(emp?.paygrade?.name ?? emp?.profile?.pay_grade_name ?? '');
      setCurrentSalary(emp?.salary ?? emp?.profile?.salary ?? '');
      setNewSalary(editingData.promoted_salary ?? editingData.new_salary ?? '');
    } else {
      form.resetFields();
      setCurrentDepartment('');
      setCurrentDesignation('');
      setCurrentPaygrade('');
      setCurrentSalary('');
      setNewSalary('');
    }
  }, [editingData, form]);

  // When employee selected, set current fields
  const handleEmployeeChange = (employeeId) => {
    const emp = employees.find(e => e.user_id === employeeId);
    if (emp) {
  setCurrentDepartment(emp.department || "");
  setCurrentDesignation(emp.designation || "");
  setCurrentPaygrade(emp.pay_grade || "");
 const cleanName = emp.pay_grade?.split(" ")[0]?.split("(")[0]?.trim();

    // Find paygrade by cleaned name
    const matchedPg = paygrades.find(
      pg => pg.grade_name.toLowerCase() === cleanName?.toLowerCase()
    );

    const salaryValue = matchedPg?.gross_salary || "";

    setCurrentSalary(salaryValue);
} else {
  setCurrentDepartment("");
  setCurrentDesignation("");
  setCurrentPaygrade("");
  setCurrentSalary("");
}


    form.setFieldsValue({ promoted_pay_grade: undefined, promoted_salary: undefined });
    setNewSalary('');
  };

  // When promoted paygrade selected, auto-fill promoted_salary
  const handlePaygradeChange = (pgId) => {
   const pg = paygrades.find(p => p.id === pgId);

  const salaryVal = pg?.gross_salary || "";

  setNewSalary(salaryVal);
  form.setFieldsValue({ promoted_salary: salaryVal });
  };

  const handleFinish = (values) => {
    // ensure promoted_salary is present (we set it on paygrade change)
    const payload = {
      employee: values.employee,
      promoted_department: values.promoted_department,
      promoted_designation: values.promoted_designation,
      promoted_pay_grade: values.promoted_pay_grade,
      promoted_salary: values.promoted_salary ?? newSalary,
      promotion_date: values.promotion_date ? values.promotion_date.format('YYYY-MM-DD') : undefined,
      description: values.description,

      current_department_name: currentDepartment,
  current_designation_name: currentDesignation,
  current_salary: currentSalary,
    };
    onSubmit(payload);
  };

  return (
    <Modal
      title={viewMode ? 'Promotion Details' : editingData ? 'Edit Promotion' : 'Add Promotion'}
      open={open}
      onCancel={onClose}
      okText={viewMode ? 'Close' : 'Save'}
      onOk={() => { if (viewMode) return onClose(); form.submit(); }}
      confirmLoading={saveLoading}
      centered
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
  label="Employee Name*"
  name="employee"
  rules={[{ required: !viewMode }]}
>
  <Select
    disabled={viewMode}
    placeholder="Select employee"
    showSearch
    optionFilterProp="children"
    onChange={handleEmployeeChange}
  >
    {employees.map(emp => (
      <Option key={emp.user_id} value={emp.user_id}>
  {emp.name}
</Option>
    ))}
  </Select>
</Form.Item>

        <Form.Item label="Current Department*">
          <Input disabled value={currentDepartment} />
        </Form.Item>

        <Form.Item label="Current Designation*">
          <Input disabled value={currentDesignation} />
        </Form.Item>

        <Form.Item label="Current Pay Grade*">
          <Input disabled value={currentPaygrade} />
        </Form.Item>

        <Form.Item label="Current Salary*">
          <Input disabled value={currentSalary} />
        </Form.Item>

        <Form.Item label="Promoted Pay Grade*" name="promoted_pay_grade" rules={[{ required: !viewMode }]}>
          <Select disabled={viewMode} placeholder="Select pay grade" onChange={handlePaygradeChange} showSearch optionFilterProp="children">
            {paygrades.map(pg => (
              <Option key={pg.id} value={pg.id}>
                {pg.name ?? pg.title ?? `Paygrade ${pg.id}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="New Salary" name="promoted_salary">
          <Input disabled value={newSalary} />
        </Form.Item>

        <Form.Item label="Promoted Department*" name="promoted_department" rules={[{ required: !viewMode }]}>
          <Select disabled={viewMode} placeholder="Select department" showSearch optionFilterProp="children">
            {departments.map(d => (
              <Option key={d.id} value={d.id}>
                {d.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Promoted Designation*" name="promoted_designation" rules={[{ required: !viewMode }]}>
          <Select disabled={viewMode} placeholder="Select designation" showSearch optionFilterProp="children">
            {designations.map(d => (
              <Option key={d.id} value={d.id}>
                {d.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Promotion Date*" name="promotion_date" rules={[{ required: !viewMode }]}>
          <DatePicker disabled={viewMode} format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input disabled={viewMode} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PromotionModal;