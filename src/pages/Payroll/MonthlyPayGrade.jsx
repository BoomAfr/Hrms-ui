import React, { useState } from "react";
import { Table, Button, Space, Card, Row, Col, Select, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import MonthlyPayGradeModal from "../../components/common/SharedModal/MonthlyPayGradeModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";
import { useMonthlyPayGrades } from "../../hooks/useMonthlyPayGrade";

const { Option } = Select;

const MonthlyPayGrade = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaygrade, setEditingPaygrade] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPaygrade, setSelectedPaygrade] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { paygrades, loading, fetchPaygrades, addPaygrade, updatePaygrade, deletePaygrade } = useMonthlyPayGrades();

  const handleAddNew = () => {
    setEditingPaygrade(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingPaygrade(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedPaygrade(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPaygrade) return;
    try {
      await deletePaygrade(selectedPaygrade.id);
      message.success("Deleted successfully");
      fetchPaygrades();
    } catch (err) {
      message.error("Delete failed");
    } finally {
      setIsConfirmOpen(false);
      setSelectedPaygrade(null);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      // calculate basic salary here if not already calculated
      const basic_salary = formData.gross_salary - ((formData.gross_salary * (100 - formData.percentage_of_basic)) / 100);
      const payload = { ...formData, basic_salary };

      if (editingPaygrade) {
        await updatePaygrade(editingPaygrade.id, payload);
        message.success("Pay Grade updated successfully");
      } else {
        await addPaygrade(payload);
        message.success("Pay Grade added successfully");
      }
      setIsModalOpen(false);
      setEditingPaygrade(null);
      fetchPaygrades();
    } catch (err) {
      message.error("Operation failed");
    }
  };

  const columns = [
    { title: "S/L", dataIndex: "sl", key: "sl", width: 80, align: "center", render: (_, __, index) => index + 1 },
    { title: "Pay Grade Name", dataIndex: "grade_name", key: "grade_name" },
    { title: "Gross Salary", dataIndex: "gross_salary", key: "gross_salary" },
    { 
      title: "Percentage of Basic", 
      dataIndex: "percentage_of_basic", 
      key: "percentage_of_basic", 
      render: (_, record) => (record.percentage_of_basic !== undefined ? `${record.percentage_of_basic}%` : "-")
    },
    { 
      title: "Basic Salary", 
      dataIndex: "basic_salary", 
      key: "basic_salary",
      render: (_, record) => record.basic_salary || 0
    },
    { title: "Overtime Rate", dataIndex: "overtime_rate", key: "overtime_rate" },
    {
      title: "Action",
      key: "action",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const filteredData = paygrades
    .map((t) => {
      // ensure all fields exist
      return {
        ...t,
        grade_name: t.grade_name || t.pay_grade_name, // fallback if different key
        basic_salary: t.basic_salary ?? (t.gross_salary && t.percentage_of_basic ? t.gross_salary - ((t.gross_salary * (100 - t.percentage_of_basic)) / 100) : 0)
      };
    })
    .filter((t) => (t.grade_name ?? "").toLowerCase().includes(searchText.toLowerCase()));

  const pagination = {
    current: currentPage,
    pageSize,
    total: filteredData.length,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Monthly Pay Grade"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add Pay Grade
          </Button>
        }
      >
        <Row style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select value={pageSize} onChange={(value) => setPageSize(value)} style={{ width: 80, marginRight: 8 }}>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span>entries</span>
          </Col>
          <Col>
            <Input.Search
              placeholder="Search pay grade..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData.map((t, i) => ({ ...t, key: t.id || i }))}
          loading={loading}
          pagination={pagination}
          size="middle"
          bordered
          scroll={{ x: 900 }}
        />
      </Card>

      {isModalOpen && (
        <MonthlyPayGradeModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          editingPaygrade={editingPaygrade}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Pay Grade"
        message={`Are you sure you want to delete this pay grade?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default MonthlyPayGrade;