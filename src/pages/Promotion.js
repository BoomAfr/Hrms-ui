import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PromotionModal from '../components/common/SharedModal/PromotionModal';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import { usePromotions } from '../hooks/usePromotion';
import { useToast } from '../hooks/useToast';

const { Option } = Select;

const Promotion = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const { Toast, contextHolder } = useToast();

  const {
    promotions,
    employees,
    departments,
    designations,
    paygrades,
    loading,
    pagination,
    fetchPromotions,
    fetchEmployees,
    fetchDropdowns,
    addPromotion,
    updatePromotion,
    deletePromotion
  } = usePromotions();

  useEffect(() => {
    fetchEmployees();
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchPromotions(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingPromotion(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedPromotion(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPromotion) return;
    try {
      await deletePromotion(selectedPromotion.id);
      Toast.success('Deleted successfully');
      fetchPromotions(currentPage, pageSize, searchText);
    } catch {
      Toast.error('Delete failed');
    } finally {
      setIsConfirmOpen(false);
      setSelectedPromotion(null);
    }
  };

  const handleSubmit = (values) => {
    if (editingPromotion) {
      updatePromotion(editingPromotion.id, values, () => setIsModalOpen(false));
    } else {
      addPromotion(values, () => setIsModalOpen(false));
    }
  };

  const columns = [
    { title: 'S/L', key: 'sl', align: 'center', render: (_, __, index) => (currentPage - 1) * pageSize + index + 1 },
    { title: 'Employee Name', dataIndex: 'employee_name', key: 'employee_name' },
    { title: 'Promotion Date', dataIndex: 'promotion_date', key: 'promotion_date' },
    {
      title: 'Promoted Department',
      dataIndex: 'promoted_department',
      key: 'promoted_department',
      render: (_, record) => `${record.previous_department} → ${record.promoted_department}`
    },
    {
      title: 'Promoted Designation',
      dataIndex: 'promoted_designation',
      key: 'promoted_designation',
      render: (_, record) => `${record.previous_designation} → ${record.promoted_designation}`
    },
    {
      title: 'Promoted Pay Grade',
      dataIndex: 'promoted_pay_grade',
      key: 'promoted_pay_grade',
      render: (_, record) => `${record.previous_pay_grade} → ${record.promoted_pay_grade}`
    },
    {
      title: 'Promoted Salary',
      dataIndex: 'promoted_salary',
      key: 'promoted_salary',
      render: (_, record) => `${record.previous_salary} → ${record.new_salary}`
    },
    { title: 'Action', key: 'action', align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      )
    }
  ];

  const paginationProps = {
    current: currentPage,
    pageSize: pageSize,
    total: pagination.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
    pageSizeOptions: ['10','20','50','100'],
    onChange: (page, size) => { setCurrentPage(page); setPageSize(size); },
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card title="Promotion List" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New Promotion</Button>}>
        <Row style={{ marginBottom: 16 }} justify="space-between" align="middle">
          <Col>
            <span>Show </span>
            <Select value={pageSize} onChange={setPageSize} style={{ width: 80 }}>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span> entries</span>
          </Col>
          <Col>
            <Input.Search placeholder="Search promotions..." allowClear onChange={e => handleSearch(e.target.value)} style={{ width: 250 }} />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={promotions.map(p => ({
  key: p.id,
  id: p.id,
  employee_name: p.employee?.profile?.full_name || p.employee?.username || 'Unknown',
  promotion_date: p.promotion_date,
  previous_department: p.employee?.department?.name || '',
  promoted_department: p.promoted_department?.name || '',
  previous_designation: p.employee?.designation?.name || '',
  promoted_designation: p.promoted_designation?.name || '',
  previous_pay_grade: p.employee?.pay_grade?.name || '',
  promoted_pay_grade: p.promoted_pay_grade?.name || '',
  previous_salary: p.employee?.salary || 0,
  new_salary: p.promoted_pay_grade?.salary || 0,
}))}
          loading={loading}
          pagination={paginationProps}
          bordered
          scroll={{ x: 1300 }}
        />
      </Card>

      {isModalOpen && (
        <PromotionModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          employees={employees}
          departments={departments}
          designations={designations}
          paygrades={paygrades}
          editingData={editingPromotion}
          loading={loading}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Promotion"
        message={`Are you sure you want to delete promotion of "${selectedPromotion?.employee_name}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Promotion;
