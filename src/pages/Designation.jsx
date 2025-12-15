import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import DesignationModal from '../components/common/SharedModal/DesignationModal';
import { useDesignations } from '../hooks/useDesignations';
import { departmentAPI } from '../services/departmentServices';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import { useToast } from '../hooks/useToast'

const { Option } = Select;

const Designation = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [departments, setDepartments] = useState([]);

  const {
    designations,
    loading,
    error,
    pagination,
    fetchDesignations,
    addDesignation,
    updateDesignation,
    deleteDesignation,
  } = useDesignations();

  const { Toast, contextHolder } = useToast();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await departmentAPI.getAll({ page: 1, page_size: 1000 });
        const data = res.data;
        if (Array.isArray(data)) setDepartments(data);
        else if (Array.isArray(data.results)) setDepartments(data.results);
        else setDepartments([]);
      } catch (err) {
        console.error('Failed to load departments', err);
        setDepartments([]);
      }
    };
    loadDepartments();
  }, []);


  useEffect(() => {
    fetchDesignations(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleAddDesignation = async (values) => {
    try {
      const payload = { name: values.name, department: values.department };

      if (editingDesignation) {
        await updateDesignation(editingDesignation.id, payload);
        Toast.success('Designation updated successfully');
      } else {
        await addDesignation(payload);
        Toast.success('Designation added successfully');
      }

      fetchDesignations(currentPage, pageSize, searchText);
      setEditingDesignation(null);
      setIsModalOpen(false);
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    const deptId =
      record.department !== undefined
        ? typeof record.department === 'object'
          ? record.department.id
          : record.department
        : record.department_id ?? null;

    setEditingDesignation({
      id: record.id ?? record.key,
      name: record.name,
      department: deptId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedDesignation(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDesignation) return;
    try {
      await deleteDesignation(selectedDesignation.id);
      Toast.success(`Deleted: ${selectedDesignation.name}`);
      fetchDesignations(currentPage, pageSize, searchText);
    } catch (error) {
      Toast.error('Failed to delete designation');
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setSelectedDesignation(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedDesignation(null);
  };

  const handleAddNew = () => {
    setEditingDesignation(null);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
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
      title: 'Designation Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: 'Department',
      dataIndex: 'department_name',
      key: 'department',
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

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: pagination.count || 0,
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
    <div className="table-page-container">
      {contextHolder}
      <Card
        className="table-page-card"
        title="Designation List"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            className="table-page-add-btn"
          >
            Add New Designation
          </Button>
        }
      >
        <Row className="table-page-filters" align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
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
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="Search designation..."
              allowClear
              value={searchText}
              onChange={handleSearch}
              className="table-page-search"
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={designations.map((d, i) => ({
              key: d.id ?? i,
              id: d.id,
              name: d.name,
              department:
                typeof d.department === 'object' && d.department !== null
                  ? d.department.id
                  : d.department,
              department_name:
                typeof d.department === 'object' && d.department !== null
                  ? d.department.name
                  : d.department_name ?? '',
            }))}
            loading={loading}
            pagination={paginationConfig}
            size="middle"
            bordered
            scroll={{ x: 600 }}
          />
        </div>
      </Card>

      {isModalOpen && (
        <DesignationModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddDesignation}
          editingDesignation={editingDesignation}
          title={editingDesignation ? 'Edit Designation' : 'Add Designation'}
          fieldLabel="Designation Name"
          departments={departments}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Designation"
        message={`Are you sure you want to delete "${selectedDesignation?.name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Designation;
