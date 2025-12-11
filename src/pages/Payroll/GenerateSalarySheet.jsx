import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Input,
  Space,
  Tag,
  Avatar,
  message
} from "antd";
import { UserOutlined,PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSalarySheets } from "../../hooks/useSalary";

const { Title } = Typography;
const { Option } = Select;

const GenerateSalarySheet = () => {
  const navigate = useNavigate();

  // Default to current month
  const [filters, setFilters] = useState({
    month: dayjs().format('YYYY-MM'),
    status: null
  });

  const { data, pagination, loading, fetchSalarySheets } = useSalarySheets(filters);

  useEffect(() => {
    fetchSalarySheets({ page: 1 });
  }, []); // Initial load

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Optionally fetch immediately or wait for a button? 
    // Screenshot logic implies immediate or explicit. 
    // Usually immediate for Select/Date in dashboards.
    fetchSalarySheets({ ...newFilters, page: 1 });
  };

  const handleMonthChange = (date, dateString) => {
    handleFilterChange('month', dateString);
  };

  const handleAction = (record) => {
    if (record.payslip_id) {
      // View Payslip
      navigate(`/payroll/salary/payslip/${record.payslip_id}`);
    } else {
      // Generate Payslip (Go to AddSalarySheet with pre-filled?) 
      // Or trigger generate API directly? 
      // Screenshot shows "Generate Payslip". 
      // User said: "on clicking generate payslip button... should open another page... last photo"
      // But if it's not generated, we can't show the payslip view yet!
      // The last photo IS the result.
      // So clicking it naturally implies we view the result. 
      // But if `payslip_id` is null, it means we haven't generated it.
      // So we probably go to `AddSalarySheet` (Generate page) for that employee?
      // OR we just generate it on the fly and THEN show it?
      // Since `AddSalarySheet` (single) requires inputting employee again, better to navigate there?
      // However, the text "Generate Payslip" implies an action.
      // If I go to `AddSalarySheet`, I should pass state.
      navigate('/payroll/salary/generate', { state: { employeeId: record.employee_id, month: filters.month } });
    }
  };

  const columns = [
    {
      title: "S/L",
      key: "sl",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Month",
      dataIndex: "month", // Not in API response explicitly, but filters.month
      render: () => dayjs(filters.month).format("MMMM YYYY"),
    },
    {
      title: "Photo",
      key: "photo",
      render: () => <Avatar icon={<UserOutlined />} />, // Placeholder
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>ID: {record.employee_id || 'N/A'}</div>
        </div>
      )
    },
    {
      title: "Pay Grade",
      dataIndex: "pay_grade",
      key: "pay_grade",
    },
    // Note: Basic Salary not in API, omitting to match data availability or showing '0' matches API
    {
      title: "Basic Salary",
      key: "basic_salary",
      render: () => "0", // Placeholder as per API limitation discussed
    },
    {
      title: "Gross Salary",
      dataIndex: "gross_salary",
      key: "gross_salary",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = 'default';
        if (status === 'Paid') color = 'green';
        if (status === 'Calculated') color = 'blue';
        if (status === 'Pending') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          style={{ backgroundColor: "#87d068", borderColor: "#87d068", fontSize: "12px" }}
          onClick={() => handleAction(record)}
        >
          {record.action || "Generate Payslip"}
          {/* Even if API returns text, user wants specifically "Generate Payslip" button logic */}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>

      {/* Top Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '8px' }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#87d068", borderColor: "#87d068" }}
          onClick={() => navigate('/salary/generate-bulk')}
        >
          Generate Bulk Salary Sheet
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: "#87d068", borderColor: "#87d068" }}
          icon={<PlusOutlined />}
          onClick={() => navigate('/salary/generate')}
        >
          Add Salary Sheet
        </Button>
      </div>

      <Card
        title={
          <span style={{ color: 'white' }}>Payment Info</span>
        }
        headStyle={{ backgroundColor: "#1890ff", border: "none" }}
        bodyStyle={{ padding: "24px" }}
      >
        <Row gutter={24} style={{ marginBottom: "24px" }}>
          <Col span={8}>
            <Title level={5}>Month</Title>
            <DatePicker
              picker="month"
              format="YYYY-MM"
              allowClear={false}
              value={dayjs(filters.month)}
              onChange={handleMonthChange}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={8}>
            <Title level={5}>Status</Title>
            <Select
              placeholder="---- Please Select ----"
              style={{ width: "100%" }}
              allowClear
              onChange={(val) => handleFilterChange('status', val)}
            >
              <Option value="Pending">Pending Calculation</Option>
              <Option value="Calculated">Ready for Payment</Option>
              <Option value="Paid">Paid</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.employee_id} // Unique key
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => fetchSalarySheets({ page, pageSize })
          }}
          bordered
        />
      </Card>
    </div>
  );
};

export default GenerateSalarySheet;
