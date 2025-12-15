import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Row, Col, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import MonthlyPayGradeModal from "../../components/common/SharedModal/MonthlyPayGradeModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";
import { useMonthlyPayGrades } from "../../hooks/useMonthlyPayGrade";
import { useToast } from "../../hooks/useToast";

const MonthlyPayGrade = () => {
  const { Toast, contextHolder } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaygrade, setEditingPaygrade] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPaygrade, setSelectedPaygrade] = useState(null);
  const [searchText, setSearchText] = useState("");

  const {
    paygrades,
    loading,
    pagination,
    fetchPaygrades,
    addPaygrade,
    updatePaygrade,
    deletePaygrade,
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
    fetchPaygrades(
      newPagination.current,
      newPagination.pageSize,
      searchText
    );
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
    } catch {
      Toast.error("Delete failed");
    } finally {
      setIsConfirmOpen(false);
      setSelectedPaygrade(null);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingPaygrade) {
        await updatePaygrade(editingPaygrade.id, formData);
        Toast.success("Pay Grade updated successfully");
      } else {
        await addPaygrade(formData);
        Toast.success("Pay Grade added successfully");
      }
      setIsModalOpen(false);
      setEditingPaygrade(null);
    } catch {
      Toast.error("Operation failed");
    }
  };

  const columns = [
    {
      title: "S/L",
      width: 80,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Pay Grade Name",
      dataIndex: "grade_name",
      align: "left",
    },
    {
      title: "Basic Salary",
      dataIndex: "basic_salary",
      align: "left",
      render: (v) => v || 0,
    },
    {
      title: "Gross Salary",
      dataIndex: "gross_salary",
      align: "left",
    },
    {
      title: "Overtime Rate",
      dataIndex: "overtime_rate",
      align: "left",
    },
    {
      title: "Action",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            className="table-action-btn table-action-btn-edit"
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            className="table-action-btn table-action-btn-delete"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="table-page-container">
      {contextHolder}

      <Card
        title="Monthly Pay Grade"
        className="table-page-card"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="table-page-add-btn"
            onClick={handleAddNew}
          >
            Add Pay Grade
          </Button>
        }
      >
        {/* FILTER BAR */}
        <Row
          className="table-page-filters"
          align="middle"
          justify="space-between"
        >
          <Col />
          <Col>
            <Input.Search
              placeholder="Search pay grade..."
              allowClear
              className="table-page-search"
              style={{ width: 250 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>

        {/* TABLE */}
        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={paygrades}
            loading={loading}
            bordered
            size="middle"
            scroll={{ x: 900 }}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            onChange={handleTableChange}
          />
        </div>
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
        message="Are you sure you want to delete this pay grade?"
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default MonthlyPayGrade;