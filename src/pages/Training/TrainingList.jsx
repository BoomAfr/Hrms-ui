import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Row, Col, Select, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TrainingListModal from "../../components/common/SharedModal/TrainingListModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";
import { useEmployeeTrainings } from "../../hooks/useTrainingList";
import { useToast } from "../../hooks/useToast";

const { Option } = Select;

const TrainingList = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { Toast, contextHolder } = useToast();

  const {
    trainings,
    loading,
    error,
    page,
    pageSize: hookPageSize,
    total,
    setSearch,
    setPage,
    setPageSize: setHookPageSize,
    refetch,
    addTraining,
    updateTraining,
    deleteTraining,
  } = useEmployeeTrainings({ initialPage: 1, initialPageSize: 10, initialSearch: "" });

  // sync hooks state with local state
  useEffect(() => { if (page) setCurrentPage(page); }, [page]);
  useEffect(() => { if (hookPageSize) setPageSize(hookPageSize); }, [hookPageSize]);
  useEffect(() => { if (error) Toast.error("Failed to load trainings"); }, [error]);

  const handleAddNew = () => {
    setEditingTraining(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingTraining(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedTraining(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTraining) return;
    try {
      await deleteTraining(selectedTraining.id);
      Toast.success("Deleted successfully");
      refetch({ page: currentPage, page_size: pageSize, search: searchText });
    } catch {
      Toast.error("Delete failed");
    } finally {
      setIsConfirmOpen(false);
      setSelectedTraining(null);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingTraining) {
        await updateTraining(editingTraining.id, formData);
        Toast.success("Training updated successfully");
      } else {
        await addTraining(formData);
        Toast.success("Training added successfully");
      }
      setIsModalOpen(false);
      setEditingTraining(null);
      refetch({ page: currentPage, page_size: pageSize, search: searchText });
    } catch {
      Toast.error("Operation failed");
    }
  };

  const handleTableChange = (pagination) => {
    const newPage = pagination.current;
    const newSize = pagination.pageSize;
    setCurrentPage(newPage);
    setPageSize(newSize);
    refetch({ page: newPage, page_size: newSize, search: searchText });
  };

  const columns = [
    { title: "S/L", key: "sl", width: 80, align: "center", render: (_, __, index) => (currentPage - 1) * pageSize + index + 1 },
    { title: "Employee Name", dataIndex: "employee_name", key: "employee_name" },
    { title: "Training Type", dataIndex: "training_type_name", key: "training_type_name", render: (_, r) => r.training_type_name ?? r.training_type?.training_type_name ?? r.training_type?.name },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Training Duration", dataIndex: "duration", key: "duration", render: (_, r) => `${r.from_date ?? ""} to ${r.to_date ?? ""}` },
    { title: "Certificate", dataIndex: "certificate_file", key: "certificate_file", width: 120, render: (_, r) => r.certificate_file ? <a href={r.certificate_file} target="_blank" rel="noreferrer">View</a> : "—" },
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
    <div className="table-page-container">
      {contextHolder}

      <Card className="table-page-card" title="Training List" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add Employee Training</Button>}>
        <Row className="table-page-filters" style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pageSize}
              onChange={(value) => { setPageSize(value); setCurrentPage(1); refetch({ page: 1, page_size: value, search: searchText }); }}
              style={{ width: 80, marginRight: 8 }}
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            entries
          </Col>

          <Col>
            <Input.Search
              placeholder="Search training..."
              allowClear
              onSearch={(val) => { setSearchText(val); setCurrentPage(1); setSearch(val); refetch({ page: 1, page_size: pageSize, search: val }); }}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              enterButton
            />
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={trainings.map((t, i) => ({ ...t, key: t.id ?? i }))}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize,
              total,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (totalCount, range) => `Showing ${range[0]} to ${range[1]} of ${totalCount} entries`,
            }}
            onChange={handleTableChange}
            size="middle"
            bordered
            scroll={{ x: 900 }}
          />
        </div>
      </Card>

      {isModalOpen && (
        <TrainingListModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          editingTraining={editingTraining}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Training"
        message={`Are you sure you want to delete this training record?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default TrainingList;