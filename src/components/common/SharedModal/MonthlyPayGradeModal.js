import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Card, message, Spin, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { allowanceAPI } from "../../../services/Payroll/allowanceServices";
import { deductionAPI } from "../../../services/Payroll/deductionServices";

const { Option } = Select;

const MonthlyPayGradeModal = ({ isModalOpen, setIsModalOpen, onSubmit, editingPaygrade }) => {
  const [form] = Form.useForm();

  const [allowanceOptions, setAllowanceOptions] = useState([]);
  const [deductionOptions, setDeductionOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to fetch options
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const [allowanceRes, deductionRes] = await Promise.all([
          allowanceAPI.list({ page_size: 100 }),
          deductionAPI.list({ page_size: 100 })
        ]);

        const allowances = allowanceRes.data.results || allowanceRes.data || [];
        const deductions = deductionRes.data.results || deductionRes.data || [];

        setAllowanceOptions(allowances);
        setDeductionOptions(deductions);
      } catch (error) {
        message.error("Failed to fetch allowances/deductions options.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isModalOpen) {
      fetchOptions();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (editingPaygrade) {
      const initAllowances = editingPaygrade.allowance_details
        ? editingPaygrade.allowance_details.map(item => item.allowance?.id || item.allowance)
        : [];
      const initDeductions = editingPaygrade.deduction_details
        ? editingPaygrade.deduction_details.map(item => item.deduction?.id || item.deduction)
        : [];

      form.setFieldsValue({
        grade_name: editingPaygrade.grade_name,
        basic_salary: editingPaygrade.basic_salary,
        overtime_rate: editingPaygrade.overtime_rate,
        allowances: initAllowances,
        deductions: initDeductions,
        
        gross_salary: editingPaygrade.gross_salary
      });
    } else {
      form.resetFields();
    }
  }, [editingPaygrade, form]);

  const calculateGrossPreview = (changedValues, allValues) => {


    const basic = parseFloat(allValues.basic_salary) || 0;
    const selectedAllowanceIds = allValues.allowances || [];

    let totalAllowance = 0;

    selectedAllowanceIds.forEach(id => {
      const allowanceParams = allowanceOptions.find(opt => opt.id === id);
      if (allowanceParams) {
        if (allowanceParams.allowance_type === 'Percentage') {
          totalAllowance += (basic * (parseFloat(allowanceParams.percentage_of_basic) || 0)) / 100;
        } else {
          totalAllowance += parseFloat(allowanceParams.limit_per_month) || 0;
        }
      }
    });

    const gross = basic + totalAllowance;
    form.setFieldsValue({ gross_salary: gross.toFixed(2) });
  };


  const handleFinish = (values) => {
    const allowancesPayload = values.allowances
      ? values.allowances.map(id => ({ allowance: id }))
      : [];

    const deductionsPayload = values.deductions
      ? values.deductions.map(id => ({ deduction: id }))
      : [];

    const payload = {
      ...values,
      allowances_to_add: allowancesPayload,
      deductions_to_add: deductionsPayload
    };

    delete payload.allowances;
    delete payload.deductions;
    delete payload.gross_salary; 

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
      title={editingPaygrade ? "Edit Monthly Pay Grade" : "Add Monthly Pay Grade"}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={720}
      centered
    >
      <Spin spinning={loading}>
        <Card size="small" style={{ borderTop: "1px solid #d9d9d9", borderRadius: 8 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
            onValuesChange={calculateGrossPreview} 
          >
            <Form.Item label="Pay Grade Name" name="grade_name" rules={[{ required: true }]}>
              <Input placeholder="Enter pay grade name" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Basic Salary" name="basic_salary" rules={[{ required: true }]}>
                  <Input type="number" placeholder="Enter basic salary" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Estimated Gross Salary (Preview)" name="gross_salary">
                  <Input type="number" readOnly placeholder="Based on Basic + Allowances" style={{ backgroundColor: '#f5f5f5', color: '#666' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Overtime Rate (per hour)" name="overtime_rate" rules={[{ required: true }]}>
              <Input type="number" placeholder="Enter overtime rate" />
            </Form.Item>

            <Form.Item label="Allowances" name="allowances">
              <Select
                mode="multiple"
                placeholder="Select allowances"
                allowClear
                optionFilterProp="children"
              >
                {allowanceOptions.map((a) => (
                  <Option key={a.id} value={a.id}>{a.allowance_name} ({a.allowance_type === 'Percentage' ? `${a.percentage_of_basic}%` : 'Fixed'})</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Deductions" name="deductions">
              <Select
                mode="multiple"
                placeholder="Select deductions"
                allowClear
                optionFilterProp="children"
              >
                {deductionOptions.map((d) => (
                  <Option key={d.id} value={d.id}>{d.deduction_name}</Option>
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
      </Spin>
    </Modal>
  );
};

export default MonthlyPayGradeModal;