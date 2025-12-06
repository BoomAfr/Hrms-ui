import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Space, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useEmployeeBonuses } from "../../hooks/useBonus";
import dayjs from "dayjs";

const { Option } = Select;

const GenerateBonus = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { bonuses, pagination, loading, refetch } = useEmployeeBonuses(filters);

  useEffect(() => {
    refetch({ page: currentPage, pageSize });
  }, [currentPage, pageSize, filters]);

  const handleSearch = (value) => {
    setSearchText(value);
    setFilters({ ...filters, search: value });
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleTableChange = (paginationConfig) => {
    setCurrentPage(paginationConfig.current);
  };
  const handleAddBonus = () => {
    navigate('/payroll/add-generate-bonus');
  };

  const columns = [
    {
      title: "S/L",
      key: "sl",
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Month",
      dataIndex: "bonus_month",
      key: "bonus_month",
      render: (date) => dayjs(date).format('MMMM YYYY'),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (value) => value || 'N/A',
    },
    {
      title: "Festival Name",
      dataIndex: "festival_name",
      key: "festival_name",
    },
    {
      title: "Gross Salary",
      dataIndex: "gross_salary",
      key: "gross_salary",
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`,
    },
    {
      title: "Basic Salary",
      dataIndex: "basic_salary",
      key: "basic_salary",
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`,
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      render: (value, record) => `${value}% of ${record.calculated_on}`,
    },
    {
      title: "Bonus Amount",
      dataIndex: "bonus_amount",
      key: "bonus_amount",
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 'Paid' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="page-container">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Space>
          <span>Show</span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 80 }}
          >
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
            <Option value={50}>50</Option>
            <Option value={100}>100</Option>
          </Select>
          <span>entries</span>
        </Space>

        <Space>
          <Input
            placeholder="Search by name or festival"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddBonus}
          >
            Generate Bonus
          </Button>
        </Space>
      </div>


      <Table
        bordered
        dataSource={bonuses}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: pagination.total,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} bonuses`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default GenerateBonus;
