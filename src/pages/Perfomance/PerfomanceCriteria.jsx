import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Row, Col, Select, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import PerformanceCriteriaModal from "../../components/common/SharedModal/PerfomanceCriteriaModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";
import { usePerformanceCategories } from "../../hooks/usePerfomanceCategory";
import { usePerformanceCriteria } from "../../hooks/usePerfomanceCriteria";
import { useToast } from "../../hooks/useToast";

const { Option } = Select;

const PerformanceCriteria = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { Toast, contextHolder } = useToast();
  const { categories } = usePerformanceCategories();
  const { criteria, loading, total, refetch, addCriteria, updateCriteria, deleteCriteria } = usePerformanceCriteria();

  // Fetch data whenever page, size, or search changes
  useEffect(() => {
    refetch({
      page: currentPage,
      page_size: pageSize,
      search: searchText,
    });
  }, [currentPage, pageSize, searchText]);

  const handleAddNew = () => {
    setEditingCriteria(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingCriteria({
      id: record.id,
      category: record.category,
      criteria_name: record.criteria_name,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedCriteria(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCriteria(selectedCriteria.id);
      Toast.success("Deleted successfully");
      refetch({ page: currentPage, page_size: pageSize, search: searchText });
    } catch {
      Toast.error("Delete failed");
    } finally {
      setIsConfirmOpen(false);
      setSelectedCriteria(null);
    }
  };

  const handleModalSubmit = async (values) => {
    try {
      if (editingCriteria) {
        await updateCriteria(editingCriteria.id, values);
        Toast.success("Criteria updated successfully");
      } else {
        await addCriteria(values);
        Toast.success("Criteria added successfully");
      }
      setIsModalOpen(false);
      setEditingCriteria(null);
      refetch({ page: currentPage, page_size: pageSize, search: searchText });
    } catch {
      Toast.error("Operation failed");
    }
  };

  const columns = [
    {
      title: "S/L",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Performance Category Name",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Performance Criteria Name",
      dataIndex: "criteria_name",
      key: "criteria_name",
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            className="table-action-btn table-action-btn-edit"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            className="table-action-btn table-action-btn-delete"
          />
        </Space>
      ),
    },
  ];

  const dataSource = criteria.map((c) => ({
    ...c,
    key: c.id,
    category_name: c.category?.name || c.category_name || "",
  }));

  const paginationConfig = {
    current: currentPage,
    pageSize,
    total,
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
    <div className="table-page-container">
      {contextHolder}

      <Card
        className="table-page-card"
        title="Performance Criteria List"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            className="table-page-add-btn"
          >
            Add New Criteria
          </Button>
        }
      >
        <Row className="table-page-filters" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pageSize}
              onChange={(v) => {
                setPageSize(v);
                setCurrentPage(1);
              }}
              className="table-page-select"
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
              allowClear
              placeholder="Search..."
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="table-page-search"
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={paginationConfig}
            bordered
            size="middle"
            scroll={{ x: 600 }}
          />
        </div>
      </Card>

      {isModalOpen && (
        <PerformanceCriteriaModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          categories={categories}
          editingCriteria={editingCriteria}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Criteria"
        message={`Are you sure you want to delete "${selectedCriteria?.criteria_name}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default PerformanceCriteria;