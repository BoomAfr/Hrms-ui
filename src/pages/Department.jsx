import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import SharedModal from '../components/common/SharedModal/SharedModal';
import { useDepartments } from '../hooks/useDepartments';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
import { useToast } from '../hooks/useToast';
const { Option } = Select;


const Department = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { Toast, contextHolder } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  // added editingDept state
  const [editingDept, setEditingDept] = useState(null);

  const [searchText, setSearchText] = useState('');



  const { departments, loading, error, refetch, addDepartment, updateDepartment, deleteDepartment } = useDepartments();


  const handleAddDepartment = async (values) => {
  if (editingDept) {
    await updateDepartment(editingDept.id, values, Toast);
    
  } else {
    await addDepartment(values);
    Toast.success("Department added successfully");
  }

  setIsModalOpen(false);
  setEditingDept(null);
};

  const loadDepartments = async (page = currentPage, size = pageSize, search = searchText) => {
    const data = await refetch(page, size, search);
    if (data && data.count !== undefined) setTotal(data.count);
  };
  const [total, setTotal] = useState(0);

  // Fetch when page, size, or search changes
  useEffect(() => {
    loadDepartments(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1); // reset to page 1
  };



  const columns = [
    {
      title: 'S/L',
      dataIndex: 'sl',
      key: 'sl',
      width: 80,
      align: 'center',
      render: (_, __, index) => index + 1, // ✅ auto index
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
    // record is table row. ensure it contains id & name
    setEditingDept({ id: record.id ?? record.key, name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    console.log("Delete clicked for:", record);
    setSelectedDept(record);
    setIsConfirmOpen(true)
  };
  const handleConfirmDelete = async () => {
    if (!selectedDept) return;
    try {
       await deleteDepartment(selectedDept.id);
    Toast.success(`Deleted: ${selectedDept.name}`);

    const result = await refetch(currentPage, pageSize, searchText);

    if (result?.results?.length === 0 && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);

      await refetch(newPage, pageSize, searchText);
    }
    } catch (error) {
      Toast.error('Failed to delete department')
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setSelectedDept(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedDept(null);
  };


  const handleAddNew = () => {
    setEditingDept(null);
    setIsModalOpen(true);
  };

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
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
        title="Department List"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Add New Department
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
              placeholder="Search department..."
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={departments
            .filter((d) => d.name.toLowerCase().includes(searchText))
            .map((d, i) => ({
              key: d.id || i,
              id: d.id,
              sl: i + 1,
              name: d.name,
            }))
          }

          loading={loading}
          pagination={pagination}
          size="middle"
          bordered
          scroll={{ x: 400 }}
        />
      </Card>
      {isModalOpen && (
        <SharedModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddDepartment} //  pass the handler
          editingDept={editingDept} // pass for prefill in modal
          loading={loading}
          fieldLabel={[
            {
              label: 'Department Name',
              name: 'name',
              isRequired: true,
              component: <Input placeholder="Enter Department Name" size="large" />,
            },
          ]}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Department"
        message={`Are you sure you want to delete "${selectedDept?.name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

    </div>
  );
};

export default Department;