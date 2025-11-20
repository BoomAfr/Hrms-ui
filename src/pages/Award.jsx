import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AwardModal from '../components/common/SharedModal/AwardModal';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import { useAwards } from '../hooks/useAward';
import { useEmployees } from '../hooks/useAward';
const { Option } = Select;

const Award = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);

  const [editingAward, setEditingAward] = useState(null);

  const [searchText, setSearchText] = useState('');

  const { awards, loading, refetch, addAward, updateAward, deleteAward } = useAwards();
  const { employees } = useEmployees();

  // handle form submit (called from AwardModal)
  const handleAddOrUpdate = async (values) => {
    try {
      if (editingAward) {
        await updateAward(editingAward.id, values);
        message.success('Award updated successfully');
      } else {
        await addAward(values);
        message.success('Award added successfully');
      }
      refetch();
      setEditingAward(null);
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
      title: 'Employee Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
      align: 'left',
    },
    {
      title: 'Award Name',
      dataIndex: 'award_name',
      key: 'award_name',
      align: 'left',
    },
    {
      title: 'Gift Name',
      dataIndex: 'gift_name',
      key: 'gift_name',
      align: 'left',
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
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

  const handleEdit = (record) => {
    setEditingAward({
      id: record.id ?? record.key,
      award_name: record.award_name,
      employee_name: record.employee_name,
      gift_name: record.gift_name,
      month: record.month,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedAward(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAward) return;
    try {
      await deleteAward(selectedAward.id);
      message.success(`Deleted: ${selectedAward.award_name}`);
      refetch();
    } catch (error) {
      message.error('Failed to delete award');
    } finally {
      setIsConfirmOpen(false);
      setSelectedAward(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedAward(null);
  };

  const handleAddNew = () => {
    setEditingAward(null);
    setIsModalOpen(true);
  };

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: awards.length,
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
        title="Award List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Award
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
              placeholder="Search award..."
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={awards
            .filter((d) =>
              (
                String(d.employee_name ?? '').toLowerCase() +
                ' ' +
                String(d.award_name ?? '').toLowerCase() +
                ' ' +
                String(d.gift_name ?? '').toLowerCase()
              ).includes(searchText)
            )
            .map((d, i) => ({
              key: d.id ?? i,
              id: d.id,
              sl: i + 1,
              employee_name: d.employee_name,
              award_name: d.award_name,
              gift_name: d.gift_name,
              month: d.month,
            }))}
          loading={loading}
          pagination={pagination}
          size="middle"
          bordered
          scroll={{ x: 700 }}
        />
      </Card>
      {isModalOpen && (
        <AwardModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddOrUpdate}
          editingAward={editingAward}
          employees={employees}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Award"
        message={`Are you sure you want to delete "${selectedAward?.award_name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Award;

