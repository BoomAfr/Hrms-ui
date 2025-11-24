import React, { useState } from "react";
import { Table, Button, Space } from "antd";

const GenerateBonus = () => {
  const [loading, setLoading] = useState(false);

  // Dummy table data
  const data = [
    {
      key: 1,
      sl: 1,
      month: "January",
      employeeName: "Admin",
      payGrade: "A1",
      festivalName: "Diwali",
      grossSalary: 55000,
      basicSalary: 30000,
      tax: 2000,
      bonusAmount: 5000,
    },
    {
      key: 2,
      sl: 2,
      month: "February",
      employeeName: "Admin",
      payGrade: "A1",
      festivalName: "Durga Puja",
      grossSalary: 55000,
      basicSalary: 30000,
      tax: 2000,
      bonusAmount: 4500,
    },
  ];

  // Table Columns
  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 70,
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
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
      title: "Festival Name",
      dataIndex: "festivalName",
      key: "festivalName",
    },
    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
    },
    {
      title: "Basic Salary",
      dataIndex: "basicSalary",
      key: "basicSalary",
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
    },
    {
      title: "Bonus Amount",
      dataIndex: "bonusAmount",
      key: "bonusAmount",
    },
  ];

  return (
    <div className="page-container">
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button type="primary">Generate Bonus</Button>
      </div>

      {/* Table */}
      <Table
        bordered
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 8 }}
        loading={loading}
      />
    </div>
  );
};

export default GenerateBonus;
