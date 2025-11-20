import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import TrainingListModal from '../../components/common/SharedModal/TrainingListModal';
import ConfirmModal from '../../components/common/SharedModal/ConfirmModal';
import { useEmployeeTrainings } from '../../hooks/useTrainingList';

const { Option } = Select;

const TrainingList = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [searchText, setSearchText] = useState('');

  const { trainings, loading, refetch, addTraining, updateTraining, deleteTraining } = useEmployeeTrainings();

  const handleAddNew = () => {
    setEditingTraining(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingTraining(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedTraining(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTraining) return;
    try {
      await deleteTraining(selectedTraining.id);
      message.success('Deleted successfully');
      refetch();
    } catch (err) {
      message.error('Delete failed');
    } finally {
      setIsConfirmOpen(false);
      setSelectedTraining(null);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingTraining) {
        await updateTraining(editingTraining.id, formData);
        message.success('Training updated successfully');
      } else {
        await addTraining(formData);
        message.success('Training added successfully');
      }
      setIsModalOpen(false);
      setEditingTraining(null);
      refetch();
    } catch (err) {
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
      title: 'Employee Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
      render: (_, record) => record.employee_name ?? record.employee?.name ?? `${record.employee?.first_name ?? ''} ${record.employee?.last_name ?? ''}`.trim(),
    },
    {
      title: 'Training Type',
      dataIndex: 'training_type_name',
      key: 'training_type_name',
      render: (_, record) => record.training_type_name ?? record.training_type?.training_type_name ?? record.training_type?.name,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Training Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (_, record) => `${record.from_date ?? ''} to ${record.to_date ?? ''}`,
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

  const filteredData = trainings.filter((t) =>
    (t.employee_name ?? t.employee?.name ?? '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
    (t.training_type_name ?? t.training_type?.training_type_name ?? '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
    (t.subject ?? '').toString().toLowerCase().includes(searchText.toLowerCase())
  );

  const pagination = {
    current: currentPage,
    pageSize,
    total: filteredData.length,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Training List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add Employee Training
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
            <Input.Search placeholder="Search training..." allowClear onChange={(e) => setSearchText(e.target.value)} style={{ width: 250 }} />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData.map((t, i) => ({ ...t, key: t.id || i }))}
          loading={loading}
          pagination={pagination}
          size="middle"
          bordered
          scroll={{ x: 900 }}
        />
      </Card>

      {isModalOpen && (
        <TrainingListModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          editingTraining={editingTraining}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Training"
        message={`Are you sure you want to delete this training record?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default TrainingList;