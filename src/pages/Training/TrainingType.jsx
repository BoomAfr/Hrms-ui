import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import TrainingTypeModal from '../../components/common/SharedModal/TrainingTypeModal';
import ConfirmModal from '../../components/common/SharedModal/ConfirmModal';
import { trainingTypeAPI } from '../../services/trainingTypeServices';
import { useToast } from '../../hooks/useToast';

const { Option } = Select;

const TrainingType = () => {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainingType, setEditingTrainingType] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTrainingType, setSelectedTrainingType] = useState(null);

  const { Toast, contextHolder } = useToast();

  const fetchTrainingTypes = async () => {
    try {
      setLoading(true);
      const res = await trainingTypeAPI.getAll();
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setTrainingTypes(data);
    } catch {
      Toast.error('Failed to fetch training types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingTypes();
  }, []);

  const handleAddNew = () => {
    setEditingTrainingType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingTrainingType(record);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record) => {
    setSelectedTrainingType(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTrainingType) return;
    try {
      await trainingTypeAPI.delete(selectedTrainingType.id);
      Toast.success('Training Type deleted successfully');
      fetchTrainingTypes();
    } catch {
      Toast.error('Failed to delete Training Type');
    } finally {
      setIsConfirmOpen(false);
      setSelectedTrainingType(null);
    }
  };

  const handleModalSubmit = async (values) => {
    try {
      if (editingTrainingType) {
        await trainingTypeAPI.update(editingTrainingType.id, values);
        Toast.success('Training Type updated successfully');
      } else {
        await trainingTypeAPI.create(values);
        Toast.success('Training Type added successfully');
      }
      setIsModalOpen(false);
      setEditingTrainingType(null);
      fetchTrainingTypes();
    } catch {
      Toast.error('Save failed');
    }
  };

  const columns = [
    { title: 'S/L', key: 'sl', width: 80, align: 'center', render: (_, __, index) => index + 1 },
    { title: 'Training Type Name', dataIndex: 'training_type_name', key: 'training_type_name', align: 'left' },
    { title: 'Status', dataIndex: 'status', key: 'status', align: 'center' },
    {
      title: 'Action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteClick(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="table-page-container">
      {contextHolder}

      <Card className="table-page-card" title="Training Type List" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Add Training Type
        </Button>
      }>
        <Row className="table-page-filters" style={{ marginBottom: 16 }} align="middle" justify="space-between">
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
            entries
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={trainingTypes.map((t, i) => ({ ...t, key: t.id || i }))}
            loading={loading}
            pagination={false}
            size="middle"
            bordered
            scroll={{ x: 600 }}
          />
        </div>
      </Card>

      {isModalOpen && (
        <TrainingTypeModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          editingTrainingType={editingTrainingType}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Training Type"
        message={`Are you sure you want to delete "${selectedTrainingType?.training_type_name}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default TrainingType;