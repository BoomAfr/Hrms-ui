import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import SharedModal from '../components/common/SharedModal/SharedModal';
import { useDepartments } from '../hooks/useDepartments';
import ConfirmModal from '../components/common/SharedModal/ConfirmModal';
const { Option } = Select;

const Department = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

    // added editingDept state
  const [editingDept, setEditingDept] = useState(null);

  const [searchText, setSearchText] = useState('');

  const { departments, loading, error, refetch, addDepartment, updateDepartment, deleteDepartment} = useDepartments();

     //console.log(departments, loading, error, refetch);
     
    // ✅ handle form submit (called from SharedModal)
  const handleAddDepartment = async (values) => {
    try {
      const payload = {name: values.name };
      if (editingDept) {
        // update flow
        await updateDepartment(editingDept.id, payload);
        message.success('Department updated successfully');
      } 
      
      else {
        // create flow
        await addDepartment(payload);
        message.success('Department added successfully');
      }
      refetch()
      setEditingDept(null);
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
    message.success(`Deleted: ${selectedDept.name}`);
    refetch();
  } catch (error) {
    message.error('Failed to delete department');
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
    total: 74, 
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