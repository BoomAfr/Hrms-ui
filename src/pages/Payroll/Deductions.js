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
        Toast.success("Updated Succesfully");
      } else {
        await createDeduction(values);
        Toast.success("Added Succesfully");
      }
      setIsModalOpen(false);
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
      Toast.success("Deduction Deleted Succesfully");
    } catch {
      Toast.error("Failed");
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
      width: 80,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Deduction Name",
      dataIndex: "deduction_name",
      align: "left",
    },
    {
      title: "Deduction Type",
      dataIndex: "deduction_type_display",
      align: "left",
    },
    {
      title: "Percentage of Basic",
      dataIndex: "percentage_of_basic",
      align: "left",
      render: (v) => (v == null ? "-" : String(v)),
    },
    {
      title: "Limit Per Month",
      dataIndex: "limit_per_month",
      align: "left",
      render: (v) => (v == null ? "-" : String(v)),
    },
    {
      title: "Action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            className="table-action-btn table-action-btn-edit"
            onClick={() => openEditModal(record)}
          />
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            className="table-action-btn table-action-btn-delete"
            onClick={() => handleDeleteClick(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="table-page-container">
      {contextHolder}

      <Card
        title="Deductions List"
        className="table-page-card"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="table-page-add-btn"
            onClick={openAddModal}
          >
            Add New Deduction
          </Button>
        }
      >
        {/* FILTERS */}
        <Row
          className="table-page-filters"
          align="middle"
          justify="space-between"
        >
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pagination.pageSize}
              onChange={(value) =>
                setPagination((p) => ({ ...p, pageSize: value }))
              }
              className="table-page-select"
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
              className="table-page-search"
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Col>
        </Row>

        {/* TABLE */}
        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={(deductions || []).map((d) => ({
              key: d.id,
              ...d,
            }))}
            loading={loading}
            bordered
            size="middle"
            scroll={{ x: 800 }}
            rowKey={(r) => r.id}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              onChange: handleTableChange,
              pageSizeOptions: ["10", "20", "50", "100"],
              showQuickJumper: true,
              showTotal: (t, range) =>
                `Showing ${range[0]} to ${range[1]} of ${t} entries`,
            }}
          />
        </div>
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