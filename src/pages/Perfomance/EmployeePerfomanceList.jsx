import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Popconfirm, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { usePerformanceModule } from "../../hooks/usePerfomanceModule";

const EmployeePerformanceList = () => {
  const navigate = useNavigate();
  const {
    listLoading,
    performanceList,
    total,
    page,
    pageSize,
    loadPerformance,
    setPage,
    setPageSize,
    removePerformance,
  } = usePerformanceModule();

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPerformance("", 1, pageSize);
    // eslint-disable-next-line
  }, []);

  const handleTableChange = (pagination) => {
    const nextPage = pagination.current;
    const nextSize = pagination.pageSize;
    setPage(nextPage);
    setPageSize(nextSize);
    loadPerformance(search, nextPage, nextSize);
  };

  const columns = [
    {
      title: "S/L",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
      width: 70,
    },
    {
      title: "Employee Name",
      dataIndex: ["employee", "full_name"],
      render: (_, record) => record.employee?.full_name || record.employee_name || "-",
    },
    {
      title: "Month",
      dataIndex: "review_month",
      render: (val) => val ? val : "-",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (val) => <div style={{ whiteSpace: "pre-wrap" }}>{val}</div>,
    },
    {
  title: "Star Rating",
  dataIndex: "overall_rating",
  render: (val) => {
    if (val == null) return "-";
    let rating = Number(val);
    if (isNaN(rating)) rating = 0;
    rating = Math.max(0, Math.min(5, Math.round(rating))); // clamp 0-5
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  },
  width: 140,
},
    {
      title: "Action",
      width: 140,
      render: (record) => (
        <Space>
          <Button onClick={() => navigate(`/employee-performance/view/${record.id}`)} shape="circle" size="small">🔍</Button>
          <Button type="primary" onClick={() => navigate(`/employee-performance/edit/${record.id}`)} shape="circle" size="small">✎</Button>
          <Popconfirm title="Delete?" onConfirm={() => removePerformance(record.id)}>
            <Button danger shape="circle" size="small">🗑</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h3>Employee Performance List</h3>
        </Col>

        <Col>
          <Space>
            <Input.Search
              placeholder="Search..."
              allowClear
              onSearch={(val) => {
                setSearch(val);
                loadPerformance(val, 1, pageSize);
              }}
              style={{ width: 220 }}
            />
            <Button type="primary" onClick={() => navigate("/add-employee-perfomance")} icon = {<PlusOutlined/>} >
              Add Employee Performance
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={performanceList}
        loading={listLoading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        rowKey="id"
      />
    </>
  );
};

export default EmployeePerformanceList;