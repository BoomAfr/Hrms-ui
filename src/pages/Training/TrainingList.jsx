import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from "antd";
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

  const {Toast,contextHolder} = useToast();

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

  useEffect(() => {
    if (page) setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    if (hookPageSize) setPageSize(hookPageSize);
  }, [hookPageSize]);

  useEffect(() => {
    if (error) message.error("Failed to load trainings");
  }, [error]);

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
      //message.success("Deleted successfully");
      // refetch current page to get correct list
      refetch({ page: currentPage, page_size: pageSize, search: searchText });
    } catch (err) {
      Toast.error("Delete failed");
      //message.error("Delete failed");
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
        //message.success("Training updated successfully");
      } else {
        await addTraining(formData);
        Toast.success("Training added successfully");
        //message.success("Training added successfully");
      }
      setIsModalOpen(false);
      setEditingTraining(null);
      // refetch current page to refresh from server
      refetch({ page: currentPage, page_size: pageSize, search: searchText });
    } catch (err) {
      message.error("Operation failed");
    }
  };

  const handleTableChange = (pagination) => {
    const newPage = pagination.current;
    const newSize = pagination.pageSize;
    setCurrentPage(newPage);
    setPageSize(newSize);
    // trigger server fetch
    refetch({ page: newPage, page_size: newSize, search: searchText });
  };

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      render: (_, record) =>
        record.employee_name ,
    },
    {
      title: "Training Type",
      dataIndex: "training_type_name",
      key: "training_type_name",
      render: (_, record) => record.training_type_name ?? record.training_type?.training_type_name ?? record.training_type?.name,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Training Duration",
      dataIndex: "duration",
      key: "duration",
      render: (_, record) => `${record.from_date ?? ""} to ${record.to_date ?? ""}`,
    },
    {
      title: "Certificate",
      dataIndex: "certificate_file",
      key: "certificate_file",
      width: 120,
      render: (_, record) =>
        record.certificate_file ? (
          <a href={record.certificate_file} target="_blank" rel="noreferrer">
            View
          </a>
        ) : (
          "—"
        ),
    },
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

  const filteredData = trainings; // server-side already filtered; keep as is

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card
        title="Training List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add Employee Training
          </Button>
        }
      >
        <Row style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
                refetch({ page: 1, page_size: value, search: searchText });
              }}
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
              placeholder="Search training..."
              allowClear
              onSearch={(val) => {
                setSearchText(val);
                setCurrentPage(1);
                setSearch(val);
                refetch({ page: 1, page_size: pageSize, search: val });
              }}
              onChange={(e) => {
                // keep typing updates but don't refetch on every keystroke — user can press enter
                setSearchText(e.target.value);
              }}
              style={{ width: 300 }}
              enterButton
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData.map((t, i) => ({ ...t, key: t.id ?? i }))}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: total,
            showSizeChanger: false, // we handle page size via dropdown on top
            showQuickJumper: true,
            showTotal: (totalCount, range) => `Showing ${range[0]} to ${range[1]} of ${totalCount} entries`,
          }}
          onChange={handleTableChange}
          size="middle"
          bordered
          scroll={{ x: 900 }}
        />
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