import React, { useState } from "react";
import { Table, Button, Card, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useBonusSetting } from "../../hooks/payroll/useBonusSetting";
import BonusSettingModal from "../../components/common/SharedModal/BonusSettingModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";

const BonusSetting = () => {
  const { bonusList, loading, createBonus, updateBonus, deleteBonus } =
    useBonusSetting();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Open add modal
  const openAddModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  // On modal form submit
  const handleSubmit = async (values) => {
    if (editingRecord) {
      await updateBonus(editingRecord.id, values);
    } else {
      await createBonus(values);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "S/L",
      align: "center",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Festival Name",
      dataIndex: "festival_name",
      align: "center",
    },
    {
      title: "Percentage of Bonus",
      dataIndex: "percentage",
      align: "center",
      render: (val) => `${val}%`,
    },
    {
      title: "Action",
      align: "center",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>

          <ConfirmModal
            title="Delete Bonus?"
            message="Are you sure you want to delete this bonus?"
            icon={<DeleteOutlined />}
            buttonText="Delete"
            onConfirm={() => deleteBonus(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Bonus Setting"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add New Bonus
          </Button>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey="id"
          columns={columns}
          dataSource={bonusList}
        />
      </Card>

      {/* Modal Component */}
      <BonusSettingModal
        open={isModalOpen}
        editingRecord={editingRecord}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BonusSetting;
