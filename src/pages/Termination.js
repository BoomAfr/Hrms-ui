import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import TerminationModal from '../components/common/SharedModal/TerminationModal';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import { useTerminations } from '../hooks/useTermination';
import { useToast } from '../hooks/useToast';

const { Option } = Select;

const Termination = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTermination, setEditingTermination] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTermination, setSelectedTermination] = useState(null);
  const { Toast, contextHolder } = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    terminations,
    employees,
    loading,
    pagination,
    fetchTerminations,
    fetchEmployees,
    addTermination,
    updateTermination,
    deleteTermination,
  } = useTerminations();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchTerminations(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setEditingTermination(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingTermination(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedTermination(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTermination) return;
    try {
      await deleteTermination(selectedTermination.id);
      Toast.success('Deleted successfully');
      fetchTerminations(currentPage, pageSize, searchText);
    } catch {
      Toast.error('Delete failed');
    } finally {
      setIsConfirmOpen(false);
      setSelectedTermination(null);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitLoading(true);

      if (editingTermination) {
        await updateTermination(editingTermination.id, values);
        Toast.success('Termination updated successfully');
      } else {
        await addTermination(values);
        Toast.success('Termination added successfully');
      }

      setIsModalOpen(false);
      fetchTerminations(currentPage, pageSize, searchText);
    } catch {
      Toast.error('Something went wrong');
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: 'S/L',
      key: 'sl',
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Termination Type',
      dataIndex: 'termination_type',
      key: 'termination_type',
    },
    {
      title: 'Notice Date',
      dataIndex: 'notice_date',
      key: 'notice_date',
    },
    {
      title: 'Termination Date',
      dataIndex: 'termination_date',
      key: 'termination_date',
    },
    {
      title: 'Terminated By',
      dataIndex: 'terminated_by_name',
      key: 'terminated_by_name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
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
        title="Termination List"
        className="table-page-card"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            className="table-page-add-btn"
          >
            Add New Termination
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
              placeholder="Search terminations..."
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
            dataSource={terminations.map((t) => ({
              key: t.id,
              ...t,
            }))}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize,
              total: pagination.total,
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
            scroll={{ x: 1200 }}
          />
        </div>
      </Card>

      {isModalOpen && (
        <TerminationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          employees={employees}
          editingData={editingTermination}
          loading={loading}
          submitLoading={submitLoading}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Termination"
        message={`Are you sure you want to delete "${selectedTermination?.employee_name}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Termination;