import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PerformanceCategoryModal from '../../components/common/SharedModal/PerfomanceCategoryModal';
import ConfirmModal from '../../components/common/SharedModal/ConfirmModal';
import { usePerformanceCategories } from '../../hooks/usePerfomanceCategory';
import {useToast} from "../../hooks/useToast"

const { Option } = Select;

const PerformanceCategory = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchText, setSearchText] = useState('');

  const{Toast,contextHolder} = useToast();

  const { categories, loading, error, refetch, addCategory, updateCategory, deleteCategory } = usePerformanceCategories();

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingCategory({ id: record.id, name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedCategory(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory.id);
      Toast.success('Deleted successfully')
      message.success('Deleted successfully');
      refetch();
    } catch (err) {
      Toast.error('Delete failed')
      message.error('Delete failed');
    } finally {
      setIsConfirmOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleModalSubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        Toast.success("Performance category updated successfully")
        message.success('Performance category updated successfully');
      } else {
        await addCategory(values);
        Toast.success("Performance category added successfully")
        message.success('Performance category added successfully');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      refetch();
    } catch (err) {
      Toast.error("Operation failed")
      message.error('Operation failed');
    }
  };

  const columns = [
    {
      title: 'S/L',
      dataIndex: 'sl',
      key: 'sl',
      width: 80,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Performance Category',
      dataIndex: 'category_name',
      key: 'category_name',
      align: 'left',
    },
    {
      title: 'Action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const filtered = categories
    .filter((c) => (c.name ?? '').toString().toLowerCase().includes(searchText.toLowerCase()))
    .map((c, i) => ({ ...c, key: c.id ?? i, sl: i + 1 }));

  const pagination = {
    current: currentPage,
    pageSize,
    total: filtered.length,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10','20','50','100'],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
  };

  return (
    <div style={{ padding: 24 }}>
    {contextHolder}
      <Card
        title="Performance Category List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Performance
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
            <Input.Search placeholder="Search performance category..." allowClear onChange={(e) => setSearchText(e.target.value)} style={{ width: 250 }} />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={pagination}
          size="middle"
          bordered
          scroll={{ x: 600 }}
        />
      </Card>

      {isModalOpen && (
        <PerformanceCategoryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          editingCategory={editingCategory}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Performance Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default PerformanceCategory;