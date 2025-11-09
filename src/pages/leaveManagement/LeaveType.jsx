import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import LeaveTypeModal from '../../components/common/SharedModal/LeaveTypeModal';
import ConfirmModal from '../../components/common/SharedModal/ConfirmModal';
import { useLeaveTypes } from '../../hooks/useLeaveType';
const { Option } = Select;

const LeaveType = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [searchText, setSearchText] = useState('');

  const { leaveTypes, loading, refetch, addLeaveType, updateLeaveType, deleteLeaveType } = useLeaveTypes();

  const handleAddLeaveType = async (values) => {
    try {
      if (editingLeaveType) {
        await updateLeaveType(editingLeaveType.id, values);
        message.success('Leave type updated successfully');
      } else {
        await addLeaveType(values);
        message.success('Leave type added successfully');
      }
      refetch();
      setEditingLeaveType(null);
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    setEditingLeaveType({
      id: record.id ?? record.key,
      name: record.name,
      number_of_days: record.number_of_days,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedLeaveType(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLeaveType) return;
    try {
      await deleteLeaveType(selectedLeaveType.id);
      message.success(`Deleted: ${selectedLeaveType.name}`);
      refetch();
    } catch (error) {
      message.error('Failed to delete leave type');
    } finally {
      setIsConfirmOpen(false);
      setSelectedLeaveType(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedLeaveType(null);
  };

  const handleAddNew = () => {
    setEditingLeaveType(null);
    setIsModalOpen(true);
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
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
      title: 'Leave Type Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: 'Number of Days',
      dataIndex: 'number_of_days',
      key: 'number_of_days',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Leave Type List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Leave Type
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
            <Input.Search placeholder="Search leave type..." allowClear onChange={(e) => handleSearch(e.target.value)} style={{ width: 250 }} />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={leaveTypes
            .filter((d) => (String(d.name).toLowerCase() + ' ' + String(d.number_of_days)).includes(searchText))
            .map((d, i) => ({
              key: d.id ?? i,
              id: d.id,
              sl: i + 1,
              name: d.name,
              number_of_days: d.number_of_days,
            }))}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: leaveTypes.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          size="middle"
          bordered
          scroll={{ x: 500 }}
        />
      </Card>

      {isModalOpen && (
        <LeaveTypeModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddLeaveType}
          editingLeaveType={editingLeaveType}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Leave Type"
        message={`Are you sure you want to delete "${selectedLeaveType?.name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default LeaveType;