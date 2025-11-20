import React, { useState } from "react";
import { Table, Button, Space, Card, Row, Col, Select, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import WorkShiftModal from "../../components/common/SharedModal/ManageWorkShiftModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";
import { useWorkShifts } from "../../hooks/useManageWorkShift";
import {useToast} from "../../hooks/useToast";

const { Option } = Select;

const WorkShift = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { shifts, loading, refetch, addShift, updateShift, deleteShift } = useWorkShifts();
  const {Toast,contextHolder} = useToast();

  const handleAddNew = () => {
    setEditingShift(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingShift(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedShift(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedShift) return;
    try {
      await deleteShift(selectedShift.id);
      Toast.success("Deleted successfully")
     // message.success("Work Shift Deleted successfully");
      refetch();
    } catch (err) {
      Toast.error("Delete failed")
      //message.error("Work Shift Delete failed");
    } finally {
      setIsConfirmOpen(false);
      setSelectedShift(null);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingShift) {
        await updateShift(editingShift.id, formData);
        Toast.success("Work Shift updated successfully")
       // message.success("Work Shift updated successfully");
      } else {
        await addShift(formData);
        Toast.success("Work Shift added successfully")
       // message.success("Work Shift added successfully");
      }
      setIsModalOpen(false);
      setEditingShift(null);
      refetch();
    } catch (err) {
      Toast.error("Operation failed")
      //message.error("Operation failed");
    }
  };

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Work Shift Name",
      dataIndex: "shift_name",
      key: "shift_name",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
    },
    {
      title: "Late Count Time",
      dataIndex: "late_count_time",
      key: "late_count_time",
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const filteredData = shifts.filter((t) =>
    (t.shift_name ?? "").toString().toLowerCase().includes(searchText.toLowerCase())
  );

  const pagination = {
    current: currentPage,
    pageSize,
    total: filteredData.length,
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
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card
        title="Manage Work Shift"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add Work Shift
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
            <Input.Search
              placeholder="Search work shift..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
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
        <WorkShiftModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          editingShift={editingShift}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Work Shift"
        message={`Are you sure you want to delete this work shift?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default WorkShift;