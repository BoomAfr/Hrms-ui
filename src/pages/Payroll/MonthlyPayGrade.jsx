import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Row, Col, Select, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import MonthlyPayGradeModal from "../../components/common/SharedModal/MonthlyPayGradeModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";
import { useMonthlyPayGrades } from "../../hooks/useMonthlyPayGrade";
import { useToast } from "../../hooks/useToast";

const { Option } = Select;

const MonthlyPayGrade = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaygrade, setEditingPaygrade] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPaygrade, setSelectedPaygrade] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { Toast, contextHolder } = useToast();

  const {
    paygrades,
    loading,
    pagination,
    fetchPaygrades,
    addPaygrade,
    updatePaygrade,
    deletePaygrade
  } = useMonthlyPayGrades();

  
  useEffect(() => {
    fetchPaygrades(1, 10, "");
  }, [fetchPaygrades]);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPaygrades(1, pagination.pageSize, searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleTableChange = (newPagination) => {
    fetchPaygrades(newPagination.current, newPagination.pageSize, searchText);
  };

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
      Toast.success("Deleted successfully");
    } catch (err) {
      Toast.error("Delete failed");
    } finally {
      setIsConfirmOpen(false);
      setSelectedPaygrade(null);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      const payload = { ...formData };

      if (editingPaygrade) {
        await updatePaygrade(editingPaygrade.id, payload);
        Toast.success("Pay Grade updated successfully");
      } else {
        await addPaygrade(payload);
        Toast.success("Pay Grade added successfully");
      }
      setIsModalOpen(false);
      setEditingPaygrade(null);
    } catch (err) {
      Toast.error("Operation failed");
    }
  };

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    { title: "Pay Grade Name", dataIndex: "grade_name", key: "grade_name" },
    {
      title: "Basic Salary",
      dataIndex: "basic_salary",
      key: "basic_salary",
      render: (val) => val || 0
    },
    { title: "Gross Salary", dataIndex: "gross_salary", key: "gross_salary" },
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

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
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
          dataSource={paygrades}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            pageSizeOptions: ["10", "20", "50", "100"]
          }}
          onChange={handleTableChange}
          size="middle"
          bordered
          scroll={{ x: 900 }}
          rowKey="id"
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