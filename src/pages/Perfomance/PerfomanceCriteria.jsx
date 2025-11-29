import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Row,
  Col,
  Select,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

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
  const {
    criteria,
    loading,
    total,
    refetch,
    addCriteria,
    updateCriteria,
    deleteCriteria,
  } = usePerformanceCriteria();

  // 🔥 API-BASED SEARCH + PAGINATION
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
      refetch({
        page: currentPage,
        page_size: pageSize,
        search: searchText,
      });
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

      refetch({
        page: currentPage,
        page_size: pageSize,
        search: searchText,
      });
    } catch (err) {
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
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  // 🔥 API response mapping only
  const dataSource = criteria.map((c) => ({
    ...c,
    key: c.id,
    category_name: c.category?.name || c.category_name || "",
  }));

  const pagination = {
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
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Card
        title="Performance Criteria List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Criteria
          </Button>
        }
      >
        <Row style={{ marginBottom: 16 }} justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pageSize}
              onChange={(v) => {
                setPageSize(v);
                setCurrentPage(1);
              }}
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
              style={{ width: 250 }}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          bordered
          size="middle"
        />
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