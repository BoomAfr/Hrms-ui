import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import WeeklyHolidayModal from '../../components/common/SharedModal/WeeklyHolidayModal';
import ConfirmModal from '../../components/common/SharedModal/ConfirmModal';
import { useWeeklyHoliday } from '../../hooks/useWeeklyHoliday';
const { Option } = Select;

const WeeklyHoliday = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedWeeklyHoliday, setSelectedWeeklyHoliday] = useState(null);
  const [editingWeeklyHoliday, setEditingWeeklyHoliday] = useState(null);
  const [searchText, setSearchText] = useState('');

  const { weeklyHolidays, loading,  refetch, addWeeklyHoliday, updateWeeklyHoliday, deleteWeeklyHoliday } = useWeeklyHoliday();

  const handleAddWeeklyHoliday = async (payload) => {
    try {
      if (editingWeeklyHoliday) {
        await updateWeeklyHoliday(editingWeeklyHoliday.id, payload);
        message.success('Weekly holiday updated successfully');
      } else {
        await addWeeklyHoliday(payload);
        message.success('Weekly holiday added successfully');
      }

      refetch();
      setEditingWeeklyHoliday(null);
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
    }
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
      title: 'Weekly Holiday Name',
      dataIndex: 'day',
      key: 'day',
      align: 'left',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'left',
      render: (isActive) => (isActive ? 'Active' : 'Non Active'),
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

  const handleEdit = (record) => {
    setEditingWeeklyHoliday({
      id: record.id ?? record.key,
      day: record.day,
      is_active: record.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedWeeklyHoliday(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedWeeklyHoliday) return;
    try {
      await deleteWeeklyHoliday(selectedWeeklyHoliday.id);
      message.success(`Deleted: ${selectedWeeklyHoliday.day}`);
      refetch();
    } catch (error) {
      message.error('Failed to delete weekly holiday');
    } finally {
      setIsConfirmOpen(false);
      setSelectedWeeklyHoliday(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedWeeklyHoliday(null);
  };

  const handleAddNew = () => {
    setEditingWeeklyHoliday(null);
    setIsModalOpen(true);
  };

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: weeklyHolidays.length,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Weekly Holiday List"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Add New Weekly Holiday
          </Button>
        }
      >
        <Row style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pageSize}
              onChange={(value) => setPageSize(value)}
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
              placeholder="Search weekly holiday..."
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={weeklyHolidays
            .filter((d) =>
              (String(d.day).toLowerCase() + ' ' + (d.is_active ? 'active' : 'non active')).includes(searchText)
            )
            .map((d, i) => ({
              key: d.id ?? i,
              id: d.id,
              sl: i + 1,
              day: d.day,
              is_active: d.is_active,
            }))}
          loading={loading}
          pagination={pagination}
          size="middle"
          bordered
          scroll={{ x: 500 }}
        />
      </Card>

      {isModalOpen && (
        <WeeklyHolidayModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddWeeklyHoliday}
          editingHoliday={editingWeeklyHoliday}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Weekly Holiday"
        message={`Are you sure you want to delete "${selectedWeeklyHoliday?.day}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default WeeklyHoliday;

