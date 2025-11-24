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
  const[saveLoading,setSaveLoading] = useState(false)

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
    // data may contain count & results
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
      Toast.success("Successfully Edited");
    } else {
      await addPromotion(values);
      Toast.success("Successfully Added");
    }

    setIsModalOpen(false);
    setEditingPromotion(null);
  } catch (err) {
    Toast.error("Something went wrong");
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
      Toast.success(`Deleted: ${selectedPromotion.employee?.profile?.full_name ?? 'Promotion'}`);
      const result = await fetchPromotions(currentPage, pageSize, searchText);
      if (result?.results?.length === 0 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (err) {
      Toast.error('Failed to delete promotion');
    } finally {
      setIsConfirmOpen(false);
      setSelectedPromotion(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedPromotion(null);
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const columns = [
  {
    title: "S/L",
    key: "sl",
    width: 80,
    align: "center",
    render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
  },
  {
    title: "Employee Name",
    dataIndex: "employee_name",
    key: "employee_name",
  },
  {
    title: "Promotion Date",
    dataIndex: "promotion_date",
    key: "promotion_date",
  },
  {
    title: "Promoted Department",
    key: "promoted_department",
    render: (_, record) =>
      `${record.current_department_name ?? "-"} → ${record.promoted_department_name ?? "-"}`,
  },
  {
    title: "Promoted Designation",
    key: "promoted_designation",
    render: (_, record) =>
      `${record.current_designation_name ?? "-"} → ${record.promoted_designation_name ?? "-"}`,
  },
{
  title: "Promoted Pay Grade",
  key: "promoted_pay_grade",
  render: (_, record) => {
    const oldId = record.current_pay_grade ? Number(record.current_pay_grade) : null;
    const newId = record.promoted_pay_grade ? Number(record.promoted_pay_grade) : null;

    const oldPg = paygrades.find(p => Number(p.id) === oldId);
    const newPg = paygrades.find(p => Number(p.id) === newId);

    const oldName = oldPg?.grade_name || "-";
    const newName = newPg?.grade_name || "-";

    return `${oldName} → ${newName}`;
  }
},
  {
    title: "Promoted Salary",
    key: "promoted_salary",
    render: (_, record) =>
      `${record.current_salary ?? "-"} → ${record.promoted_salary ?? "-"}`,
  },
  {
    title: "Action",
    key: "action",
    width: 120,
    align: "center",
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
  const paginationProps = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: total,
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
    <div style={{ padding: '24px' }}>
      {contextHolder}
      <Card
        title="Promotion List"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Add Promotion
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
              placeholder="Search promotion..."
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={promotions
            .filter((p) => (p.employee?.profile?.full_name ?? p.employee?.name ?? '').toLowerCase().includes(searchText))
            .map((p, i) => ({
              key: p.id || i,
              id: p.id,
              ...p,
            }))
          }
          loading={loading}
          pagination={paginationProps}
          size="middle"
          bordered
          scroll={{ x: 1200 }}
        />
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
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Promotion;