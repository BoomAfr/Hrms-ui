
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import SharedModal from '../../components/common/SharedModal/ManageHolidayModal';
import ConfirmModal from '../../components/common/SharedModal/ConfirmModal';
import { useManageHoliday } from '../../hooks/useManageHoliday';
import {useToast} from '../../hooks/useToast';

const { Option } = Select;

const ManageHoliday = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [searchText, setSearchText] = useState('');

  const {
    manageHoliday,
    loading,
    error,
    refetch,
    addManageHoliday,
    updateManageHoliday,
    deleteManageHoliday,
  } = useManageHoliday();

  const {Toast, contextHolder} = useToast();

  const handleAddManageHoliday = async (values) => {
    try {
      const payload = { name: values.name };
      if (editingHoliday) {
        await updateManageHoliday(editingHoliday.id, payload);
        Toast.success('Holiday updated successfully');
       // message.success('Holiday updated successfully');
      } else {
        await addManageHoliday(payload);
        Toast.success('Holiday added successfully');
        //message.success('Holiday added successfully');
      }
      refetch();
      setEditingHoliday(null);
      setIsModalOpen(false);
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Operation failed');
     // message.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const loadManagEmployee = async (page = currentPage, size = pageSize, search = searchText) => {
    const data = await refetch(page, size, search);
    if (data && data.count !== undefined) setTotal(data.count);
  };
  const [total, setTotal] = useState(0);
  
  // Fetch when page, size, or search changes
  useEffect(() => {
    loadManagEmployee(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1); // reset to page 1
  };

  const handleEdit = (record) => {
    setEditingHoliday({ id: record.id ?? record.key, name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedHoliday(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedHoliday) return;
    try {
      await deleteManageHoliday(selectedHoliday.id);
      Toast.success(`Deleted: ${selectedHoliday.name}`);
     // message.success(`Deleted: ${selectedHoliday.name}`);
      refetch();
    } catch (error) {
      Toast.error('Failed to delete holiday');
     // message.error('Failed to delete holiday');
    } finally {
      setIsConfirmOpen(false);
      setSelectedHoliday(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedHoliday(null);
  };

  const handleAddNew = () => {
    setEditingHoliday(null);
    setIsModalOpen(true);
  };

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
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

  return (
    <div style={{ padding: '24px' }}>
      {contextHolder}
      <Card
        title="Manage Holiday"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Add New Holiday
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
              placeholder="Search holiday..."
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={manageHoliday
            .filter((h) => h.name.toLowerCase().includes(searchText))
            .map((h, i) => ({
              key: h.id || i,
              id: h.id,
              sl: i + 1,
              name: h.name,
            }))}
          loading={loading}
          pagination={pagination}
          size="middle"
          bordered
          scroll={{ x: 400 }}
        />
      </Card>

      {isModalOpen && (
        <SharedModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddManageHoliday}
          editingDept={editingHoliday}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Holiday"
        message={`Are you sure you want to delete "${selectedHoliday?.name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ManageHoliday;
