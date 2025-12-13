import React, { useEffect } from "react";
import { Table, Card, Button, Image, Tag } from "antd";
import { FilePdfOutlined, EyeOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMyPayroll } from "../../hooks/useMyPayroll";
import { useNavigate } from "react-router-dom";

const MyPayroll = () => {
  const { payrollHistory, loading, pagination, fetchMyPayroll } = useMyPayroll();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPayroll(1, 10);
  }, [fetchMyPayroll]);

  const handleTableChange = (pagination) => {
    fetchMyPayroll(pagination.current, pagination.pageSize);
  };

  // Table columns
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
      render: (photo) => photo ? <Image src={photo} width={40} height={40} preview={false} /> : '--',
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
      render: (val) => val ? `₹${parseFloat(val).toLocaleString()}` : '0',
    },
    {
      title: "Gross Salary",
      dataIndex: "gross_salary",
      key: "gross_salary",
      render: (val) => val ? `₹${parseFloat(val).toLocaleString()}` : '0',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : "red"}>
          {status}
        </Tag>
      ),
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
        >
          View Payslip
        </Button>
      ),
    },
  ];

  // Generate PDF
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

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="My Payroll"
        extra={
          <Button type="primary" icon={<FilePdfOutlined />} onClick={downloadPDF}>
            Download PDF
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={payrollHistory}
          rowKey={(record) => record.payslip_id}
          bordered
          size="middle"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default MyPayroll;