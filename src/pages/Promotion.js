import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PromotionModal from '../components/common/SharedModal/PromotionModal';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import { usePromotion } from '../hooks/usePromotion';
import { useToast } from '../hooks/useToast';

const { Option } = Select;

const Promotion = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { Toast, contextHolder } = useToast();
  const [saveLoading, setSaveLoading] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const [editingPromotion, setEditingPromotion] = useState(null);
  const [searchText, setSearchText] = useState('');

  const {
    promotions,
    employees,
    departments,
    designations,
    paygrades,
    loading,
    pagination,
    fetchPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
  } = usePromotion();

  const [total, setTotal] = useState(0);

  const loadPromotions = async (page = currentPage, size = pageSize, search = '') => {
    const data = await fetchPromotions(page, size, search);
    if (data && data.count !== undefined) setTotal(data.count);
  };

  useEffect(() => {
    loadPromotions(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1);
  };

  const handleAddPromotion = async (values) => {
    setSaveLoading(true);
    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, values);
        Toast.success('Successfully Edited');
      } else {
        await addPromotion(values);
        Toast.success('Successfully Added');
      }
      setIsModalOpen(false);
      setEditingPromotion(null);
    } catch {
      Toast.error('Something went wrong');
    } finally {
      setSaveLoading(false);
    }
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
      Toast.success(
        `Deleted: ${selectedPromotion.employee?.profile?.full_name ?? 'Promotion'}`
      );
      const result = await fetchPromotions(currentPage, pageSize, searchText);
      if (result?.results?.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch {
      Toast.error('Failed to delete promotion');
    } finally {
      setIsConfirmOpen(false);
      setSelectedPromotion(null);
    }
  };

  const columns = [
    {
      title: 'S/L',
      key: 'sl',
      width: 80,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Promotion Date',
      dataIndex: 'promotion_date',
      key: 'promotion_date',
    },
    {
      title: 'Promoted Department',
      key: 'promoted_department',
      render: (_, record) =>
        `${record.current_department_name ?? '-'} → ${record.promoted_department_name ?? '-'}`,
    },
    {
      title: 'Promoted Designation',
      key: 'promoted_designation',
      render: (_, record) =>
        `${record.current_designation_name ?? '-'} → ${record.promoted_designation_name ?? '-'}`,
    },
    {
      title: 'Promoted Pay Grade',
      key: 'promoted_pay_grade',
      render: (_, record) => {
        const oldPg = paygrades.find(p => Number(p.id) === Number(record.current_pay_grade));
        const newPg = paygrades.find(p => Number(p.id) === Number(record.promoted_pay_grade));
        return `${oldPg?.grade_name || '-'} → ${newPg?.grade_name || '-'}`;
      },
    },
    {
      title: 'Promoted Salary',
      key: 'promoted_salary',
      render: (_, record) =>
        `${record.current_salary ?? '-'} → ${record.promoted_salary ?? '-'}`,
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
        title="Promotion List"
        className="table-page-card"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPromotion(null);
              setIsModalOpen(true);
            }}
            className="table-page-add-btn"
          >
            Add Promotion
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
              placeholder="Search promotion..."
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
            dataSource={promotions
              .filter((p) =>
                (p.employee?.profile?.full_name ?? p.employee?.name ?? '')
                  .toLowerCase()
                  .includes(searchText)
              )
              .map((p, i) => ({
                key: p.id || i,
                ...p,
              }))}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total,
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
        <PromotionModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPromotion}
          employees={employees}
          departments={departments}
          designations={designations}
          paygrades={paygrades}
          editingData={editingPromotion}
          loading={loading}
          saveLoading={saveLoading}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Promotion"
        message={`Are you sure you want to delete promotion for "${selectedPromotion?.employee?.profile?.full_name ?? selectedPromotion?.employee?.name}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Promotion;