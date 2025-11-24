import React, { useState } from "react";
import { Table, Card, Button, Space, Row, Col, Image } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyPayroll = () => {
  // Dummy data
  const [data, setData] = useState([
    {
      key: 1,
      month: "November 2025",
      photo: "https://i.pravatar.cc/40?img=1",
      employeeName: "Admin",
      payGrade: "A1",
      basicSalary: 50000,
      grossSalary: 65000,
      status: "Paid",
    },
    {
      key: 2,
      month: "October 2025",
      photo: "https://i.pravatar.cc/40?img=2",
      employeeName: "Admin",
      payGrade: "A1",
      basicSalary: 50000,
      grossSalary: 65000,
      status: "Unpaid",
    },
    {
      key: 3,
      month: "September 2025",
      photo: "https://i.pravatar.cc/40?img=3",
      employeeName: "Admin",
      payGrade: "A1",
      basicSalary: 50000,
      grossSalary: 65000,
      status: "Paid",
    },
  ]);

  // Table columns
  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
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
      render: (photo) => <Image src={photo} width={40} height={40} preview={false} />,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Pay Grade",
      dataIndex: "payGrade",
      key: "payGrade",
    },
    {
      title: "Basic Salary",
      dataIndex: "basicSalary",
      key: "basicSalary",
      render: (val) => `₹${val.toLocaleString()}`,
    },
    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
      render: (val) => `₹${val.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "Paid" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button type="primary">Generate Payslip</Button>
      ),
    },
  ];

  // Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Payroll Report", 14, 16);
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
      body: data.map((item, index) => [
        index + 1,
        item.month,
        item.employeeName,
        item.payGrade,
        item.basicSalary,
        item.grossSalary,
        item.status,
      ]),
    });
    doc.save("payroll.pdf");
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
          dataSource={data}
          bordered
          size="middle"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default MyPayroll;