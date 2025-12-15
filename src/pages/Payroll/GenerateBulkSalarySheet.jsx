import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  message,
  Typography
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useGenerateBulkPayslip } from "../../hooks/useSalary";
import { departmentAPI } from "../../services/departmentServices";
import { branchAPI } from "../../services/branchServices";
import { designationAPI } from "../../services/designationServices";

const { Title } = Typography;
const { Option } = Select;

const GenerateBulkSalarySheet = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { generateBulk, loading: generating } = useGenerateBulkPayslip();

  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Fetch departments, branches, designations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptRes = await departmentAPI.getAll();
        setDepartments(deptRes.data.results || deptRes.data || []);

        const branchRes = await branchAPI.getAll({ page_size: 1000 });
        setBranches(branchRes.data.results || branchRes.data || []);

        const desigRes = await designationAPI.getAll(1, 1000); // Assuming page 1, size 1000
        // designationAPI.getAll signature: (page, pageSize, search)
        setDesignations(desigRes.data.results || desigRes.data || []);
      } catch (e) {
        console.error("Failed to fetch dropdown data", e);
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values) => {
    if (!values.month) {
      message.error("Month is required");
      return;
    }

    const payload = {
      month: dayjs(values.month).format('YYYY-MM'),
      branch_id: values.branch,
      department_id: values.department,
      designation_id: values.designation
    };

    // Remove undefined keys
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    try {
      const result = await generateBulk(payload);
      message.success(result.message || "Bulk generation completed successfully!");
      if (result.failed > 0) {
        message.warning(`${result.failed} falied. Check console/logs.`);
      }
      // Navigate to List page after success?
      setTimeout(() => navigate('/payroll/generate-salary-sheet'), 1500);
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <div className="table-page-container">
      {/* Top Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button
          type="primary"
          className="table-page-add-btn"
          onClick={() => navigate('/payroll/generate-salary-sheet')}
        >
          Generate Payslip
        </Button>
      </div>

      <Card
        className="table-page-card"
        title="Generate Bulk Salary Sheet"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="Branch" name="branch">
                <Select placeholder="All Branches" allowClear showSearch optionFilterProp="children">
                  {branches.map(b => (
                    <Option key={b.id} value={b.id}>{b.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Department" name="department">
                <Select placeholder="All Departments" allowClear showSearch optionFilterProp="children">
                  {departments.map(d => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Designation" name="designation">
                <Select placeholder="All Designation" allowClear showSearch optionFilterProp="children">
                  {designations.map(d => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={<span style={{ color: 'red' }}>Month*</span>}
                name="month"
                rules={[{ required: true, message: 'Please select month!' }]}
              >
                <DatePicker picker="month" format="YYYY-MM" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center" style={{ marginTop: '24px' }}>
            <Button type="primary" htmlType="submit" loading={generating} style={{ minWidth: '200px' }}>
              Generate Bulk Salary Sheet
            </Button>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default GenerateBulkSalarySheet;