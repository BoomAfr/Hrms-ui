import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Row,
  Col,
  Select,
  Input,
  Modal,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useToast } from "../../hooks/useToast";
import { useAllowances } from "../../hooks/payroll/useAllowance";
import AllowanceModal from "../../components/common/SharedModal/AllowanceModal";

const Allowance = () => {
  const { Toast, contextHolder } = useToast();
  const {
    allowances,
    loading,
    pagination,
    setPagination,
    handleSearch,
    createAllowance,
    updateAllowance,
    deleteAllowance,
  } = useAllowances();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [modal, modalContextHolder] = Modal.useModal();

  const openAddModal = () => {
    setEditingAllowance(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingAllowance(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAllowance(null);
  };

  const handleModalSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingAllowance) {
        await updateAllowance(editingAllowance.id, values);
        Toast.success("Succesfully Updated");
      } else {
        await createAllowance(values);
        Toast.success("Succesfully Added");
      }
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (record) => {
    modal.confirm({
      title: "Delete Allowance",
      content: `Are you sure you want to delete "${record.allowance_name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteAllowance(record.id);
          Toast.success("Deleted Succesfully");
        } catch {
          Toast.error("Faied to Delete");
        }
      },
    });
  };

  const handleTableChange = (page, size) => {
    setPagination((p) => ({ ...p, current: page, pageSize: size }));
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
      title: "Allowance Name",
      dataIndex: "allowance_name",
      align: "left",
    },
    {
      title: "Allowance Type",
      dataIndex: "allowance_type_display",
      align: "left",
    },
    {
      title: "Percentage of Basic",
      dataIndex: "percentage_of_basic",
      align: "left",
      render: (v) => (v ?? "-"),
    },
    {
      title: "Limit Per Month",
      dataIndex: "limit_per_month",
      align: "left",
      render: (v) => (v ?? "-"),
    },
    {
      title: "Action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            className="table-action-btn table-action-btn-edit"
            onClick={() => openEditModal(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
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
      {modalContextHolder}

      <Card
        title="Allowance List"
        className="table-page-card"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="table-page-add-btn"
            onClick={openAddModal}
          >
            Add New Allowance
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
              <Select.Option value={10}>10</Select.Option>
              <Select.Option value={20}>20</Select.Option>
              <Select.Option value={50}>50</Select.Option>
              <Select.Option value={100}>100</Select.Option>
            </Select>
            <span>entries</span>
          </Col>

          <Col>
            <Input.Search
              placeholder="Search Allowance..."
              allowClear
              className="table-page-search"
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => {
                const q = e.target.value;
                setSearchText(q);
                handleSearch(q);
              }}
            />
          </Col>
        </Row>

        {/* TABLE */}
        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={allowances.map((a) => ({ ...a, key: a.id })) || []}
            loading={loading}
            bordered
            size="middle"
            scroll={{ x: 600 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              onChange: handleTableChange,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (t, range) =>
                `Showing ${range[0]} to ${range[1]} of ${t} entries`,
            }}
          />
        </div>
      </Card>

      <AllowanceModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialValues={editingAllowance}
        submitting={submitting}
      />
    </div>
  );
};

export default Allowance;
