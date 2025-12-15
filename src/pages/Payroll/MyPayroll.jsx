import React, { useEffect } from "react";
import { Table, Card, Button, Image, Tag, Row, Col, Select, Input } from "antd";
import { FilePdfOutlined, EyeOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMyPayroll } from "../../hooks/useMyPayroll";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;

const MyPayroll = () => {
  const { payrollHistory, loading, pagination, fetchMyPayroll } = useMyPayroll();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPayroll(1, 10);
  }, [fetchMyPayroll]);

  const handleTableChange = (pagination) => {
    fetchMyPayroll(pagination.current, pagination.pageSize);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("My Payroll Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [
        [
          "S/L",
          "Month",
          "Employee Name",
          "Pay Grade",
          "Basic Salary",
          "Gross Salary",
          "Status",
        ],
      ],
      body: payrollHistory.map((item, index) => [
        index + 1,
        item.month,
        item.employee_name,
        item.pay_grade,
        item.basic_salary,
        item.gross_salary,
        item.status,
      ]),
    });
    doc.save("my_payroll.pdf");
  };

  const columns = [
    {
      title: "S/L",
      key: "sl",
      width: 60,
      align: "center",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      align: "left",
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      align: "center",
      render: (photo) => (photo ? <Image src={photo} width={40} height={40} preview={false} /> : "--"),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Pay Grade",
      dataIndex: "pay_grade",
      key: "pay_grade",
    },
    {
      title: "Basic Salary",
      dataIndex: "basic_salary",
      key: "basic_salary",
      render: (val) => (val ? `₹${parseFloat(val).toLocaleString()}` : "0"),
    },
    {
      title: "Gross Salary",
      dataIndex: "gross_salary",
      key: "gross_salary",
      render: (val) => (val ? `₹${parseFloat(val).toLocaleString()}` : "0"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "Paid" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/payroll/salary/payslip/${record.id || record.payslip_id}`)}
          className="table-action-btn table-action-btn-edit"
        >
          View Payslip
        </Button>
      ),
    },
  ];

  return (
    <div className="table-page-container">
      <Card
        className="table-page-card"
        title="My Payroll"
        extra={
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={downloadPDF}
            className="table-page-add-btn"
          >
            Download PDF
          </Button>
        }
      >
        {/* Filters Row (currently only PDF button) */}
        <Row className="table-page-filters" align="middle" justify="space-between" style={{ marginBottom: 16 }}>
          <Col></Col>
        </Row>

        {/* Table Wrapper */}
        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={payrollHistory.map((p) => ({ key: p.payslip_id, ...p }))}
            rowKey={(record) => record.payslip_id}
            bordered
            size="middle"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default MyPayroll;