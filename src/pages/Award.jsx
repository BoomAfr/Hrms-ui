import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AwardModal from '../components/common/SharedModal/AwardModal';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import { useAwards, useEmployees } from '../hooks/useAward';
import { useToast } from '../hooks/useToast';

const { Option } = Select;

const Award = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [editingAward, setEditingAward] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { Toast, contextHolder } = useToast();

  const {
    awards,
    total,
    page,
    pageSize,
    loading,
    error,
    setPage,
    setPageSize,
    setSearch,
    fetchAwards,
    refetch,
    addAward,
    updateAward,
    deleteAward,
  } = useAwards({ initialPage: 1, initialPageSize: 10 });

  const { employees } = useEmployees();

  useEffect(() => {
    if (error) message.error('Failed to load awards');
  }, [error]);

  const handleAddOrUpdate = async (values) => {
    try {
      if (editingAward && editingAward.id) {
        await updateAward(editingAward.id, values);
        Toast.success('Award updated successfully');
        message.success('Award updated successfully');
      } else {
        await addAward(values);
        Toast.success('Award added successfully');
        message.success('Award added successfully');
      }
      setEditingAward(null);
      setIsModalOpen(false);
    } catch (err) {
      Toast.error(err.response?.data || 'Operation failed');
      message.error(err.response?.data || 'Operation failed');
    }
  };

  const handleEdit = (record) => {

    setEditingAward({
      id: record.id,
      award_name: record.award_name,
      employee: record.employee,
      gift_item: record.gift_item,
      award_month: record.award_month,
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
      Toast.success("Deleted Succesfully");
      message.success(`Deleted: ${selectedAward.award_name}`);
      setIsConfirmOpen(false);
      setSelectedAward(null);
    } catch (err) {
      Toast.error('Failed to delete award');
      message.error('Failed to delete award');
    }
  };

  const handleSearch = (val) => {
    const s = (val || '').trim();
    setSearchText(s);
    setSearch(s);
    // fetch page 1 with new search
    fetchAwards({ page: 1, page_size: pageSize, search: s });
  };

  const handleTableChange = (pagination) => {
    const newPage = pagination.current;
    const newSize = pagination.pageSize;
    setPage(newPage);
    setPageSize(newSize);
    fetchAwards({ page: newPage, page_size: newSize, search: searchText });
  };

  const columns = [
    {
      title: 'S/L',
      dataIndex: 'sl',
      key: 'sl',
      width: 80,
      align: 'center',
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
      align: 'left',
    },
    {
      title: 'Award Name',
      dataIndex: 'display_award_name',
      key: 'display_award_name',
      align: 'left',
    },
    {
      title: 'Gift Item',
      dataIndex: 'gift_item',
      key: 'gift_item',
      align: 'left',
    },
    {
      title: 'Month',
      dataIndex: 'display_month',
      key: 'display_month',
      align: 'left',
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} className="table-action-btn table-action-btn-edit" />
          <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record)} className="table-action-btn table-action-btn-delete" />
        </Space>
      ),
    },
  ];

  return (
    <div className="table-page-container">
      {contextHolder}
      <Card
        className="table-page-card"
        title="Award List"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => { setEditingAward(null); setIsModalOpen(true); }}
            className="table-page-add-btn"
          >
            Add New Award
          </Button>
        }
      >
        <Row className="table-page-filters" align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                fetchAwards({ page: 1, page_size: value, search: searchText });
              }}
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
              placeholder="Search awards..."
              allowClear
              onSearch={handleSearch}
              className="table-page-search"
              style={{ width: 300 }}
            />
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={awards.map((d, i) => ({ ...d, key: d.id ?? i }))}
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (totalCount, range) => `Showing ${range[0]} to ${range[1]} of ${totalCount} entries`,
            }}
            onChange={handleTableChange}
            size="middle"
            bordered
            scroll={{ x: 900 }}
          />
        </div>
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
        onCancel={() => { setIsConfirmOpen(false); setSelectedAward(null); }}
      />
    </div>
  );
};

export default Award;

