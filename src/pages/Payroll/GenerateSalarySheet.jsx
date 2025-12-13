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
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSalarySheets } from "../../hooks/useSalary";
import { markPaymentPaid } from "../../services/salaryService";

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
      navigate('/payroll/salary/generate', { state: { employeeId: record.employee_id, month: filters.month } });
    }
  };

  const handleMakePayment = async (payslipIds) => {
    const ids = Array.isArray(payslipIds) ? payslipIds : [payslipIds];
    try {
      const payload = {
        payment_type: 'salary',
        item_ids: ids,
        payment_method: 'Bank Transfer',
        payment_date: new Date().toISOString().split('T')[0]
      };

      await markPaymentPaid(payload);
      message.success('Payment marked successfully');

      // Refresh the list
      fetchSalarySheets({ ...filters, page: pagination.current });
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to mark payment');
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
      dataIndex: "month",
      render: () => dayjs(filters.month).format("MMMM YYYY"),
    },
    {
      title: "Photo",
      key: "photo",
      render: () => <Avatar icon={<UserOutlined />} />,
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

    {
      title: "Basic Salary",
      key: "basic_salary",
      render: () => "0",
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
      render: (_, record) => {
        if (record.status === 'Calculated') {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => handleAction(record)}
              >
                View/Re-generate
              </Button>
              <Button
                type="primary"
                size="small"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={() => handleMakePayment(record.payslip_id)}
              >
                Make Payment
              </Button>
            </Space>
          );
        }

        if (record.status === 'Paid') {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => handleAction(record)}
            >
              View Payslip
            </Button>
          );
        }

        // Pending or no payslip_id
        return (
          <span style={{ color: '#faad14', fontSize: '12px' }}>
            Generate Salary Sheet First
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px" }}>

      {/* Top Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '8px' }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#eafff5ff", borderColor: "#000000ff", color: "#000000ff" }}
          onClick={() => {
            const calculatedRecords = data.filter(r => r.status === 'Calculated' && r.payslip_id);
            const ids = calculatedRecords.map(r => r.payslip_id);
            if (ids.length > 0) handleMakePayment(ids);
          }}
          disabled={!data.some(r => r.status === 'Calculated')}
        >
          Make Bulk Payment
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: "#87d068", borderColor: "#87d068" }}
          onClick={() => navigate('/salary/generate-bulk')}
          icon={<PlusOutlined />}
        >
          Generate Bulk Salary Sheet
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: "#87d068", borderColor: "#87d068" }}
          icon={<PlusOutlined />}
          onClick={() => navigate('/salary/generate')}
        >
          Generate Single Salary Sheet
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
