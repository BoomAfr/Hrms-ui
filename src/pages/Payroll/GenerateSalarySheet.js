// src/pages/Payroll/GenerateSalarySheet.jsx
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  Table,
  Avatar,
  Tag,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { useSalarySheet } from "../../hooks/payroll/useGenerateSalarySheet";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const GenerateSalarySheet = () => {
  const navigate = useNavigate();

  const {
    rows,
    loading,
    pagination,
    setPagination,
    filters,
    handleFilter,
    generatePayslip,
  } = useSalarySheet();

  const [selectedMonth, setSelectedMonth] = useState(
    filters.month ? dayjs(filters.month) : null
  );
  const [selectedStatus, setSelectedStatus] = useState(filters.status || "");

  const formatMonth = (m) => (m ? dayjs(m).format("YYYY-MM") : "");

  const onFilterClick = () => {
    const month = formatMonth(selectedMonth);
    handleFilter({ month, status: selectedStatus });
  };

  const handleTableChange = (page, pageSize) => {
    setPagination((p) => ({ ...p, current: page, pageSize }));
  };

  const handleGeneratePayslipClick = async (record) => {
    try {
      const month =
        record.payment_month ?? formatMonth(selectedMonth) ?? filters.month;

      const employeeId =
        record.employee_id ?? record.user_id ?? record.id ?? null;

      if (!employeeId) {
        message.error("Employee ID not found.");
        return;
      }

      const payslipId = await generatePayslip({ employee_id: employeeId, month });

      if (payslipId) navigate(`/payslip/${payslipId}`);
      else navigate("/payslip/generate", { state: { employee_id: employeeId, month } });
    } catch (err) {}
  };

  const columns = [
    {
      title: "S/L",
      width: 70,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Month",
      dataIndex: "payment_month",
      render: (v) => (v ? dayjs(v).format("YYYY-MM") : formatMonth(selectedMonth)),
    },
    {
      title: "Photo",
      width: 80,
      render: (_, record) => (
        <Avatar style={{ backgroundColor: "#87d068" }}>
          {(record.employee_name || "A").charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
    },
    {
      title: "Pay Grade",
      dataIndex: "pay_grade",
    },
    {
      title: "Basic Salary",
      dataIndex: "basic_salary",
      render: (v) => (v == null ? "-" : v),
    },
    {
      title: "Gross Salary",
      dataIndex: "gross_salary",
      render: (v) => (v == null ? "-" : v),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (s) => {
        let color = "blue";
        if (s === "Paid") color = "green";
        else if (s === "Pending" || s === "Calculated" || s === "Unpaid") color = "gold";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Action",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleGeneratePayslipClick(record)}>
            Generate Payslip
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = (rows || []).map((r) => ({
    key: r.payslip_id ?? r.employee_id ?? r.id,
    ...r,
  }));

  return (
    <div style={{ padding: 24 }}>
      <Row justify="end" style={{ marginBottom: 12, gap: 8 }}>
        <Button onClick={() => navigate("/salary/generate-bulk")}>
          Generate Bulk Salary Sheet
        </Button>

        <Button onClick={() => navigate("/salary/generate")}>
          Add Salary Sheet
        </Button>
      </Row>

      <Card title="Generate Salary Sheet">
        <Row gutter={12} style={{ marginBottom: 16 }} align="middle">
          <Col>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(v) => setSelectedMonth(v)}
              allowClear={false}
            />
          </Col>

          <Col>
            <Select
              placeholder="Select Status"
              style={{ width: 160 }}
              value={selectedStatus}
              onChange={(v) => setSelectedStatus(v)}
              allowClear
            >
              <Option value="Paid">Paid</Option>
              <Option value="Unpaid">Unpaid</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Calculated">Calculated</Option>
            </Select>
          </Col>

          <Col>
            <Button type="primary" onClick={onFilterClick}>
              Filter
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: handleTableChange,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          rowKey={(r) => r.key}
          bordered
          size="middle"
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  );
};

export default GenerateSalarySheet;