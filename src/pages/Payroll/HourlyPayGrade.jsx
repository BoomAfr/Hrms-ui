import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import HourlyPaygradeModal from '../../components/common/SharedModal/HourlyPayGradeModal';
import { useHourlyPaygrades } from '../../hooks/useHourlyPayGrade';
import ConfirmModal from '../../components/common/SharedModal/ConfirmModal';
import { useToast } from '../../hooks/useToast';

const { Option } = Select;
const { Search } = Input;

const HourlyPaygrade = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaygrade, setEditingPaygrade] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState('');

  const {
    hourlyPaygrades,
    loading,
    pagination,
    fetchPaygrades,
    addPaygrade,
    updatePaygrade,
    deletePaygrade,
  } = useHourlyPaygrades();

  const { Toast, contextHolder } = useToast();

  useEffect(() => {
    fetchPaygrades(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleAddOrUpdate = async (payload) => {
    try {
      if (editingPaygrade) {
        await updatePaygrade(editingPaygrade.id, payload);
        Toast.success('Hourly paygrade updated successfully');
      } else {
        await addPaygrade(payload);
        Toast.success('Hourly paygrade added successfully');
      }
      setEditingPaygrade(null);
      setIsModalOpen(false);
      fetchPaygrades(currentPage, pageSize, searchText);
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    setEditingPaygrade({
      id: record.id ?? record.key,
      pay_grade_name: record.pay_grade_name,
      hourly_rate: record.hourly_rate,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedItem(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deletePaygrade(selectedItem.id);
      Toast.success(`Deleted: ${selectedItem.pay_grade_name}`);
      fetchPaygrades(currentPage, pageSize, searchText);
    } catch (err) {
      Toast.error('Failed to delete hourly paygrade');
    } finally {
      setIsConfirmOpen(false);
      setSelectedItem(null);
    }
  };

  // ✔️ SEARCH FIX
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1);
  };

  const columns = [
    {
      title: 'S/L',
      dataIndex: 'sl',
      key: 'sl',
      width: 80,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Hourly Grade',
      dataIndex: 'pay_grade_name',
      key: 'pay_grade_name',
      align: 'left',
    },
    {
      title: 'Hourly Paid',
      dataIndex: 'hourly_rate',
      key: 'hourly_rate',
      align: 'right',
      render: (val) => (val === null || val === undefined ? '' : Number(val).toFixed(2)),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button danger type="primary" icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const paginationConfig = {
    current: currentPage,
    pageSize,
    total: pagination.count || 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Card
        title="Hourly Paygrade"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingPaygrade(null); setIsModalOpen(true); }}>
            Add New Paygrade
          </Button>
        }
      >
        <Row style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select value={pageSize} onChange={(v) => setPageSize(v)} style={{ width: 80, marginRight: 8 }}>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span>entries</span>
          </Col>

          <Col>
            <Search
              placeholder="Search paygrade..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 260 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={hourlyPaygrades.map((p, i) => ({
            key: p.id ?? i,
            id: p.id,
            pay_grade_name: p.pay_grade_name,
            hourly_rate: p.hourly_rate,
          }))}
          loading={loading}
          pagination={paginationConfig}
          size="middle"
          bordered
          scroll={{ x: 600 }}
        />
      </Card>

      {isModalOpen && (
        <HourlyPaygradeModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddOrUpdate}
          editingPaygrade={editingPaygrade}
          title={editingPaygrade ? 'Edit Hourly Paygrade' : 'Add Hourly Paygrade'}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Hourly Paygrade"
        message={`Are you sure you want to delete "${selectedItem?.pay_grade_name}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => { setIsConfirmOpen(false); setSelectedItem(null); }}
      />
    </div>
  );
};

export default HourlyPaygrade;