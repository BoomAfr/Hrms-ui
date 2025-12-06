import React, { useState } from "react";
import { Table, Button, Space, Card, Row, Col, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import BonusSettingModal from "../../components/common/SharedModal/BonusSettingModal";
import ConfirmModal from "../../components/common/SharedModal/ConfirmModal";
import { useBonusSetting } from "../../hooks/payroll/useBonusSetting";
import { useToast } from "../../hooks/useToast";

const BonusSetting = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState(null);
  const {Toast,contextHolder}=useToast();
  const [submitLoading, setSubmitLoading] = useState(false);


  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState(null);

  const [searchText, setSearchText] = useState("");

  const { bonusList, loading, createBonus, updateBonus, deleteBonus } = useBonusSetting();

  const handleAddNew = () => {
    setEditingBonus(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingBonus(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedBonus(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBonus) return;

    try {
      await deleteBonus(selectedBonus.id);
      Toast.success("Bonus deleted successfully");
    } catch (err) {
      Toast.error("Delete failed");
      message.error("Delete failed");
    } finally {
      setIsConfirmOpen(false);
      setSelectedBonus(null);
    }
  };

  const handleModalSubmit = async (formData) => {
  setSubmitLoading(true);

  try {
    if (editingBonus) {
      await updateBonus(editingBonus.id, formData);
      Toast.success("Bonus updated successfully");
    } else {
      await createBonus(formData);
      Toast.success("Bonus created successfully");
    }

    setIsModalOpen(false);
    setEditingBonus(null);
  } catch (err) {
    Toast.error("Operation failed");
  } finally {
    setSubmitLoading(false);
  }
};


  const columns = [
    { 
      title: "S/L",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1 
    },
    { title: "Festival Name", dataIndex: "festival_name" },
    { 
      title: "Percentage of Bonus",
      dataIndex: "percentage_of_basic",
      render: (val) => (val !== undefined ? `${val}%` : "-")
    },
    {
      title: "Action",
      width: 140,
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
            danger
            type="primary"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const filteredData = bonusList.filter((t) =>
    (t.festival_name || "").toLowerCase().includes(searchText.toLowerCase())
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

    showTotal: (total, range) =>
      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card
        title="Bonus Setting"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add Bonus
          </Button>
        }
      >
        <Row style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{ width: 80, marginRight: 8, padding: "4px" }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </Col>

          <Col>
            <Input.Search
              placeholder="Search festival..."
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
        />
      </Card>

      {isModalOpen && (
        <BonusSettingModal
         open={isModalOpen}
         onCancel={() => setIsModalOpen(false)}
         editingRecord={editingBonus}
         onSubmit={handleModalSubmit}
         confirmLoading={submitLoading}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Bonus"
        message={`Are you sure you want to delete this bonus?`}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default BonusSetting;