// src/pages/Payroll/Deductions.jsx
import React, { useState } from "react";
import { Table, Button, Space, Card, Row, Col, Select, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useToast } from "../../hooks/useToast";
import { useDeductions } from "../../hooks/payroll/useDeduction";
import DeductionModal from "../../components/common/SharedModal/DeductionModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";

const { Option } = Select;

const Deductions = () => {
  const { Toast, contextHolder } = useToast();
  const {
    deductions,
    loading,
    pagination,
    setPagination,
    handleSearch,
    createDeduction,
    updateDeduction,
    deleteDeduction,
  } = useDeductions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState(null);

  const openAddModal = () => {
    setEditingDeduction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingDeduction(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDeduction(null);
  };

  const handleModalSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingDeduction) {
        await updateDeduction(editingDeduction.id, values);
        Toast.success("Updated Succesfully")
      } else {
        await createDeduction(values);
        Toast.success("Added Succesfully")
      }
      setIsModalOpen(false);
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  const onSearchChange = (value) => {
    setSearchText(value);
    handleSearch(value);
  };

  const handleDeleteClick = (record) => {
    setSelectedDeduction(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeduction) return;
    try {
      await deleteDeduction(selectedDeduction.id);
      Toast.success("Deduction Deleted Succesfully")
    } catch (err) {
      Toast.error("Failed")
    } finally {
      setIsConfirmOpen(false);
      setSelectedDeduction(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedDeduction(null);
  };

  const handleTableChange = (page, pageSize) => {
    setPagination((p) => ({ ...p, current: page, pageSize }));
  };

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Deduction Name",
      dataIndex: "deduction_name",
      key: "deduction_name",
      align: "left",
    },
    {
      title: "Deduction Type",
      dataIndex: "deduction_type_display",
      key: "deduction_type_display",
      align: "left",
    },
    {
      title: "Percentage of Basic",
      dataIndex: "percentage_of_basic",
      key: "percentage_of_basic",
      align: "left",
      render: (v) => (v == null ? "-" : String(v)),
    },
    {
      title: "Limit Per Month",
      dataIndex: "limit_per_month",
      key: "limit_per_month",
      align: "left",
      render: (v) => (v == null ? "-" : String(v)),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => openEditModal(record)} />
          <Button danger type="primary" icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteClick(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}

      <Card
        title="Deductions List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add New Deduction
          </Button>
        }
      >
        <Row style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pagination.pageSize}
              onChange={(value) => setPagination((p) => ({ ...p, pageSize: value }))}
              style={{ width: 80, marginRight: 8 }}
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span>entries</span>
          </Col>

          <Col>
            <Input.Search
              placeholder="Search Deduction..."
              allowClear
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={(deductions || []).map((d) => ({ key: d.id, ...d }))}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, size) => handleTableChange(page, size),
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (t, range) => `Showing ${range[0]} to ${range[1]} of ${t} entries`,
          }}
          rowKey={(r) => r.id}
          size="middle"
          bordered
          scroll={{ x: 800 }}
        />
      </Card>

      <DeductionModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialValues={editingDeduction}
        submitting={submitting}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Deduction"
        message={`Are you sure you want to delete "${selectedDeduction?.deduction_name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Deductions;