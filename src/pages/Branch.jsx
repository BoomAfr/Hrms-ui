import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CommonFormModal from '../components/common/SharedModal/BranchModal';
import { useBranches } from '../hooks/useBranches';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import{useToast} from'../hooks/useToast';
const { Option } = Select;

const Branch = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [searchText, setSearchText] = useState('');

  const { branches, loading, error, refetch, addBranch, updateBranch, deleteBranch } = useBranches();

  const {Toast, contextHolder}=useToast();  

  useEffect(() => {
    refetch(currentPage, pageSize, searchText.trim());
  }, [currentPage, pageSize, searchText]);

  const handleAddBranch = async (values) => {
    try {
      const payload = { name: values.name };
      if (editingBranch) {
        await updateBranch(editingBranch.id, payload);
        Toast.success('Branch updated successfully');
       // message.success('Branch updated successfully');
      } else {
        await addBranch(payload);
        Toast.success('Branch added successfully');
      //  message.success('Branch added successfully');
      }
      refetch(currentPage, pageSize, searchText.trim());
      setEditingBranch(null);
      setIsModalOpen(false);
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Operation failed');
      //message.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setCurrentPage(1); // reset to first page on search
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

  const handleEdit = (record) => {
    setEditingBranch({ id: record.id ?? record.key, name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedBranch(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBranch) return;
    try {
      await deleteBranch(selectedBranch.id);
      Toast.success(`Deleted: ${selectedBranch.name}`);
      //message.success(`Deleted: ${selectedBranch.name}`);
      refetch(currentPage, pageSize, searchText.trim());
    } catch (error) {
      Toast.error('Failed to delete branch');
     // message.error('Failed to delete branch');
    } finally {
      setIsConfirmOpen(false);
      setSelectedBranch(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedBranch(null);
  };

  const handleAddNew = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: 74, // backend pagination count can be handled later if available
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
      {contextHolder}
      <Card
        title="Branch List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Branch
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
              placeholder="Search branch..."
              allowClear
              onChange={handleSearch}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={branches.map((d, i) => ({
            key: d.id || i,
            id: d.id,
            sl: i + 1,
            name: d.name,
          }))}
          loading={loading}
          pagination={pagination}
          size="middle"
          bordered
          scroll={{ x: 400 }}
        />
      </Card>

      {isModalOpen && (
        <CommonFormModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddBranch}
          editingDept={editingBranch}
          fieldLabel={[
              {
                label: 'Branch Name',
                name: 'name',
                isRequired: true,
                component: <Input placeholder="Enter Branch Name" size="large" />,
              },
            ]}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Branch"
        message={`Are you sure you want to delete "${selectedBranch?.name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Branch;
