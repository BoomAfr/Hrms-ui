import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Card } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { Option } = Select;

const percentageOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

const allowanceOptions = ["House Rent", "Car Allowance", "Medical Allowance", "Conveyance"];
const deductionOptions = ["Provident Fund"];

const MonthlyPayGradeModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingPaygrade }) => {
  const [form] = Form.useForm();
  const [allowanceSelected, setAllowanceSelected] = useState([]);
  const [deductionSelected, setDeductionSelected] = useState([]);

  useEffect(() => {
    if (editingPaygrade) {
      const initAllowances = editingPaygrade.allowances || [];
      const initDeductions = editingPaygrade.deductions || [];
      form.setFieldsValue({
        grade_name: editingPaygrade.grade_name,
        gross_salary: editingPaygrade.gross_salary,
        percentage_of_basic: editingPaygrade.percentage_of_basic,
        basic_salary: editingPaygrade.basic_salary,
        overtime_rate: editingPaygrade.overtime_rate,
        allowances: initAllowances,
        deductions: initDeductions,
      });
      setAllowanceSelected(initAllowances);
      setDeductionSelected(initDeductions);
    } else {
      form.resetFields();
      setAllowanceSelected([]);
      setDeductionSelected([]);
    }
  }, [editingPaygrade, form]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      basic_salary: values.gross_salary - ((values.gross_salary * (100 - values.percentage_of_basic)) / 100),
    };
    onSubmit(payload);
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setAllowanceSelected([]);
    setDeductionSelected([]);
  };

  const handleAllowanceChange = (values) => {
    if (values.includes("Select All")) {
      setAllowanceSelected(allowanceOptions);
      form.setFieldsValue({ allowances: allowanceOptions });
    } else {
      setAllowanceSelected(values);
    }
  };

  const handleDeductionChange = (values) => {
    if (values.includes("Select All")) {
      setDeductionSelected(deductionOptions);
      form.setFieldsValue({ deductions: deductionOptions });
    } else {
      setDeductionSelected(values);
    }
  };

  return (
    <Modal
      title={editingPaygrade ? "Edit Monthly Pay Grade" : "Add Monthly Pay Grade"}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={720}
      centered
    >
      <Card size="small" style={{ borderTop: "1px solid #d9d9d9", borderRadius: 8 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.gross_salary || changedValues.percentage_of_basic) {
              const gross = allValues.gross_salary  ;
              const perc = allValues.percentage_of_basic ;
              const basic = gross - (gross * (100 - perc) / 100);
              form.setFieldsValue({ basic_salary: basic });
            }
          }}
        >
          <Form.Item label="Pay Grade Name" name="grade_name" rules={[{ required: true }]}>
            <Input placeholder="Enter pay grade name" />
          </Form.Item>

          <Form.Item label="Gross Salary" name="gross_salary" rules={[{ required: true }]}>
            <Input type="number" placeholder="Enter gross salary" />
          </Form.Item>

          <Form.Item label="Percentage of Basic" name="percentage_of_basic" rules={[{ required: true }]}>
            <Select placeholder="Select percentage">
              {percentageOptions.map((p) => (
                <Option key={p} value={p}>{p}%</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Basic Salary" name="basic_salary">
            <Input type="number" placeholder="Calculated automatically" readOnly />
          </Form.Item>

          <Form.Item label="Overtime Rate (per hour)" name="overtime_rate" rules={[{ required: true }]}>
            <Input type="number" placeholder="Enter overtime rate" />
          </Form.Item>

          <Form.Item label="Allowances" name="allowances">
            <Select
              mode="multiple"
              placeholder="Select allowances"
              allowClear
              value={allowanceSelected}
              onChange={handleAllowanceChange}
            >
              <Option key="select_all" value="Select All">Select All</Option>
              {allowanceOptions.map((a) => (
                <Option key={a} value={a}>{a}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Deductions" name="deductions">
            <Select
              mode="multiple"
              placeholder="Select deductions"
              allowClear
              value={deductionSelected}
              onChange={handleDeductionChange}
            >
              <Option key="select_all" value="Select All">Select All</Option>
              {deductionOptions.map((d) => (
                <Option key={d} value={d}>{d}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">Save</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default MonthlyPayGradeModal;