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
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useGeneratePayslip } from "../../hooks/useSalary";
import { manageEmployeeApi } from "../../services/manageEmployeeServices";

const { Title } = Typography;
const { Option } = Select;

const AddSalarySheet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { generate, loading: generating } = useGeneratePayslip();

  const [employees, setEmployees] = useState([]);
  const [loadingEmps, setLoadingEmps] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmps(true);
      try {
        const res = await manageEmployeeApi.getAll({ page_size: 1000, status: 'Active' });
        setEmployees(res.data.results || res.data || []);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      } finally {
        setLoadingEmps(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (location.state && location.state.employeeId) {
      form.setFieldsValue({
        employee: location.state.employeeId,
        month: location.state.month ? dayjs(location.state.month) : null
      });
    }
  }, [location.state, form]);

  const onFinish = async (values) => {
    const payload = {
      employee_id: values.employee,
      month: dayjs(values.month).format('YYYY-MM')
    };

    try {
      const result = await generate(payload);
      message.success(result.message || "Payslip generated successfully!");

      if (result.payslip_id) {
        navigate(`/payroll/salary/payslip/${result.payslip_id}`);
      } else {
        navigate('/payroll/generate-salary-sheet');
      }
    } catch (error) {
      message.error(typeof error === 'string' ? error : "Failed to generate salary.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Top Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#87d068", borderColor: "#87d068" }}
          onClick={() => navigate('/payroll/generate-salary-sheet')} // Use bulk link or list? Screenshot shows "Generate Payslip" on bulk page too.
        // Actually usually "Back" or "List". I'll put "Generate List" logic if needed.
        // But matching screenshot 2? Screenshot 2 has "Generate Payslip" button on top right too? 
        // No, screenshot 2 header button says "Generate Payslip". 
        // Wait, screenshot 2 IS "Generate Payslip" page. 
        // The button on top right says "Generate Payslip" -> Self link?
        // Maybe it goes to List? Or Bulk? 
        // I will replicate screenshot: "Generate Payslip" button on top right.
        >
          Generate Payslip
        </Button>
      </div>

      <Card
        title={<span style={{ color: 'white' }}>Generate Salary Sheet</span>}
        headStyle={{ backgroundColor: "#1890ff", border: "none" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={24} align="bottom">
            <Col span={10}>
              <Form.Item
                label={<span style={{ color: 'red' }}>Employee*</span>}
                name="employee"
                rules={[{ required: true, message: 'Please select employee' }]}
              >
                <Select
                  placeholder="---- Please select ----"
                  loading={loadingEmps}
                  showSearch
                  optionFilterProp="children"
                >
                  {employees.map(emp => (
                    <Option key={emp.user_id} value={emp.user_id}>{emp.name} ({emp.employee_id})</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                label={<span style={{ color: 'red' }}>Month*</span>}
                name="month"
                rules={[{ required: true, message: 'Please select month' }]}
              >
                <DatePicker picker="month" format="YYYY-MM" style={{ width: '100%' }} placeholder="Month" />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={generating}
                  style={{ width: '100%' }}
                >
                  Generate Salary
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AddSalarySheet;