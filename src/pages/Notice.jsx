import React, { useState } from "react";
import { Table, Button, Space, Card, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import NoticeModal from "../components/common/SharedModal/NoticeModal";
import ConfirmModal from "../components/common/SharedModal/ConfirmModal";
import { useNotices } from "../hooks/useNotice";
import { noticeAPI } from "../services/noticeServices";

const Notice = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const { notices, loading, refetch, addNotice, updateNotice, deleteNotice } =
    useNotices();

  const handleAddNew = () => {
    setEditingNotice(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingNotice(record);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = async (record) => {
    try {
      const res = await noticeAPI.getById(record.id);
      setEditingNotice(res.data);
      setIsViewMode(true);
      setIsModalOpen(true);
    } catch (err) {
      message.error("Failed to fetch notice details");
    }
  };

  const handleDelete = (record) => {
    setSelectedNotice(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteNotice(selectedNotice.id);
      message.success("Deleted successfully");
      setIsConfirmOpen(false);
      setSelectedNotice(null);
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingNotice) {
        await updateNotice(editingNotice.id, formData);
        message.success("Notice updated successfully");
      } else {
        await addNotice(formData);
        message.success("Notice added successfully");
      }
      setIsModalOpen(false);
      setEditingNotice(null);
    } catch (err) {
      message.error("Operation failed");
    }
  };

  const columns = [
    { title: "S/L", dataIndex: "sl", key: "sl", align: "center", render: (_, __, i) => i + 1 },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Publish Date", dataIndex: "publish_date", key: "publish_date" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Notice List"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Notice
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={notices.map((n, i) => ({ ...n, key: n.id, sl: i + 1 }))}
          loading={loading}
          bordered
          scroll={{ x: 600 }}
        />
      </Card>

      {isModalOpen && (
        <NoticeModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleModalSubmit}
          editingNotice={editingNotice}
          isViewMode={isViewMode}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Notice"
        message={`Are you sure you want to delete "${selectedNotice?.title}"?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Notice;