import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col, Select, Button, Input, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddRoleModal from "../../components/common/SharedModal/AddRoleModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";
import { useAddRoles } from "../../hooks/useAddRole";
import { useToast } from "../../hooks/useToast";

const { Option } = Select;

const AddRole = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const { Toast, contextHolder } = useToast();

  const { roles, loading, refetch, addRole, updateRole, deleteRole } = useAddRoles();

  const loadRoles = async (page = currentPage, size = pageSize, search = searchText) => {
    const data = await refetch(page, size, search);
    if (data && data.count !== undefined) setTotal(data.count);
  };

  useEffect(() => {
    loadRoles();
  }, [currentPage, pageSize, searchText]);

  const handleAddNew = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRole({ id: record.id ?? record.key, name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRole(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;
    try {
      await deleteRole(selectedRole.id);
      Toast.success(`Deleted: ${selectedRole.name}`);
      await loadRoles();
    } catch (error) {
      Toast.error("Failed to delete role");
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setSelectedRole(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedRole(null);
  };

  const handleModalSubmit = async (values) => {
    try {
      if (editingRole) {
        await updateRole(editingRole.id, values);
        Toast.success("Role updated successfully");
      } else {
        await addRole(values);
        Toast.success("Role added successfully");
      }
      setIsModalOpen(false);
      setEditingRole(null);
      await loadRoles();
    } catch (err) {
      Toast.error("Operation failed");
      console.error(err);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Role",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const pagination = {
    current: currentPage,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
  };

  return (
    <div className="table-page-container">
      {contextHolder}
      <Card
        className="table-page-card"
        title="Role List"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New Role</Button>}
      >
        <Row className="table-page-filters" gutter={16} align="middle" justify="space-between">
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
              placeholder="Search role..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={roles
              .filter((d) => d.name.toLowerCase().includes(searchText))
              .map((d, i) => ({ ...d, key: d.id || i }))}
            loading={loading}
            pagination={pagination}
            size="middle"
            bordered
            scroll={{ x: 400 }}
          />
        </div>
      </Card>

      {isModalOpen && (
        <AddRoleModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          editingRole={editingRole}
          fieldLabel={[
            {
              label: "Role Name",
              name: "name",
              isRequired: true,
              component: <Input placeholder="Enter Role Name" size="large" />,
            },
          ]}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Role"
        message={`Are you sure you want to delete "${selectedRole?.name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AddRole;