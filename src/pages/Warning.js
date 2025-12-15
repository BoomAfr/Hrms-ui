import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import WarningModal from '../components/common/SharedModal/WarningModal';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import { useWarning } from '../hooks/useWarning';
import { useToast } from '../hooks/useToast';

const { Option } = Select;

const Warning = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { Toast, contextHolder } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState(null);

  const [editingWarning, setEditingWarning] = useState(null);
  const [searchText, setSearchText] = useState('');

  const {
    warnings,
    employees,
    loading,
    fetchWarnings,
    addWarning,
    updateWarning,
    deleteWarning,
  } = useWarning();

  const [total, setTotal] = useState(0);

  const loadWarnings = async (page = currentPage, size = pageSize, search = searchText) => {
    const data = await fetchWarnings(page, size, search);
    if (data && data.total !== undefined) setTotal(data.total);
  };

  useEffect(() => {
    loadWarnings(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1);
  };

  const handleAddWarning = (values) => {
    if (editingWarning) {
      updateWarning(editingWarning.id, values, Toast);
      Toast.success('Warning Update Successfully');
    } else {
      addWarning(values, Toast);
      Toast.success('Warning Added Successfully');
    }
    setIsModalOpen(false);
    setEditingWarning(null);
  };

  const handleEdit = (record) => {
    setEditingWarning(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedWarning(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedWarning) return;
    try {
      await deleteWarning(selectedWarning.id);
      Toast.success(`Deleted: ${selectedWarning.employee_name}`);
      const result = await fetchWarnings(currentPage, pageSize, searchText);
      if (result?.length === 0 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch {
      Toast.error('Failed to delete warning');
    } finally {
      setIsConfirmOpen(false);
      setSelectedWarning(null);
    }
  };

  const columns = [
    {
      title: 'S/L',
      key: 'sl',
      width: 80,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Warning Type',
      dataIndex: 'warning_type',
      key: 'warning_type',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Warning Date',
      dataIndex: 'warning_date',
      key: 'warning_date',
    },
    {
      title: 'Warning By',
      dataIndex: 'warning_by_name',
      key: 'warning_by_name',
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
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

  return (
    <div className="table-page-container">
      {contextHolder}

      <Card
        title="Warning List"
        className="table-page-card"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingWarning(null);
              setIsModalOpen(true);
            }}
            className="table-page-add-btn"
          >
            Add Warning
          </Button>
        }
      >
        <Row className="table-page-filters" align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pageSize}
              onChange={(value) => setPageSize(value)}
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
              placeholder="Search warning..."
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              className="table-page-search"
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={warnings
              .filter((w) => w.employee_name?.toLowerCase().includes(searchText))
              .map((w, i) => ({
                key: w.id || i,
                ...w,
              }))}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            bordered
            scroll={{ x: 800 }}
          />
        </div>
      </Card>

      {isModalOpen && (
        <WarningModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddWarning}
          employees={employees}
          editingData={editingWarning}
          loading={loading}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Warning"
        message={`Are you sure you want to delete "${selectedWarning?.employee_name}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Warning;