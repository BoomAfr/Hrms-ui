import React, { useEffect, useState } from "react";
import { Card, Row, Col, Select, DatePicker, Button, Table, InputNumber, Space } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { departmentAPI } from "../../services/departmentServices";
import { useToast } from "../../hooks/useToast";

const ApproveWorkHour = () => {
  const { Toast, contextHolder } = useToast();

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [loading, setLoading] = useState(false);

  // Dummy table values
  const [data, setData] = useState([
    {
      id: 1,
      emp_no: "1001",
      employee_name: "Admin",
      in_time: "10:00 AM",
      out_time: "06:00 PM",
      total_hour: "8 hr",
      approve_hour: 0,
      approve_min: 0,
      status: "Pending",
    },
    {
      id: 2,
      emp_no: "1002",
      employee_name: "Admin",
      in_time: "09:30 AM",
      out_time: "06:00 PM",
      total_hour: "8.5 hr",
      approve_hour: 0,
      approve_min: 0,
      status: "Pending",
    },
  ]);

  const fetchDepartments = async () => {
    try {
      const res = await departmentAPI.getAll()
      setDepartments(res.data.results || []);
    } catch (err) {
      Toast.error("Failed to load departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFilter = () => {
    if (!selectedDept || !selectedDate) {
      Toast.warning("Please select department & date");
      return;
    }
    Toast.success("Filtered data");
  };

  const handleApprove = (record) => {
    Toast.success(`Approved ${record.employee_name}`);
  };

  const handleApproveAll = () => {
    Toast.success("All records approved");
  };

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Fingerprint/Emp No",
      dataIndex: "emp_no",
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      align: "left",
    },
    {
      title: "In Time",
      dataIndex: "in_time",
      align: "center",
    },
    {
      title: "Out Time",
      dataIndex: "out_time",
      align: "center",
    },
    {
      title: "Total Working Hour",
      dataIndex: "total_hour",
      align: "center",
    },
    {
      title: "Approve Hour",
      dataIndex: "approve_hour",
      align: "center",
      render: (value, record) => (
        <InputNumber
          min={0}
          max={12}
          value={value}
          onChange={(v) =>
            setData((prev) =>
              prev.map((item) =>
                item.id === record.id ? { ...item, approve_hour: v } : item
              )
            )
          }
        />
      ),
    },
    {
      title: "Approve Minutes",
      dataIndex: "approve_min",
      align: "center",
      render: (value, record) => (
        <InputNumber
          min={0}
          max={59}
          value={value}
          onChange={(v) =>
            setData((prev) =>
              prev.map((item) =>
                item.id === record.id ? { ...item, approve_min: v } : item
              )
            )
          }
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (v) => <b style={{ color: "#faad14" }}>{v}</b>, // Pending in yellow
    },
    {
      title: "Approve",
      key: "approve",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={() => handleApprove(record)}
        >
          Approve
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Card title="Approve Work Hour">
        {/* Filters */}
        <Row style={{ marginBottom: 20 }} gutter={16} align="middle">
          <Col span={6}>
            <Select
              placeholder="Select Department"
              style={{ width: "100%" }}
              value={selectedDept}
              onChange={(v) => setSelectedDept(v)}
              loading={loading}
            >
              {departments.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col span={6}>
            <DatePicker
              style={{ width: "100%" }}
              value={selectedDate}
              onChange={(v) => setSelectedDate(v)}
            />
          </Col>

          <Col>
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Col>

          <Col>
            <Button type="primary" danger onClick={handleApproveAll}>
              Approve All
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={data.map((d) => ({ ...d, key: d.id }))}
          bordered
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ApproveWorkHour;
