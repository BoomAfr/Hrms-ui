import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Row,
  Col,
  Select,
  Input,
  InputNumber,
  Form,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { useLateConfiguration } from "../../../hooks/payroll/useLateConfiguration";
import { useToast } from "../../../hooks/useToast";
import ConfirmModal from "../../../components/common/SharedModal/ConfirmModal";

const { Option } = Select;

const LateConfiguration = () => {
  const { Toast, contextHolder } = useToast(); // FIXED

  const {
    rules,
    loading,
    createRule,
    updateRule,
    deleteRule,
  } = useLateConfiguration();

  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = rules.filter(
    (item) =>
      item.status.toLowerCase().includes(searchText.toLowerCase()) ||
      item.late_days_threshold.toString().includes(searchText) ||
      item.deduction_days.toString().includes(searchText)
  );

  const columns = [
    {
      title: "S/L",
      align: "center",
      width: 70,
      render: (_, __, index) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "For Days",
      dataIndex: "late_days_threshold",
      align: "center",
      render: (text, record) =>
        editingId === record.id ? (
          <Form.Item
            name="late_days_threshold"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Enter days" }]}
          >
            <InputNumber min={1} max={31} style={{ width: "100%" }} />
          </Form.Item>
        ) : (
          <span>{text} days</span>
        ),
    },
    {
      title: "Day of Salary Deduction",
      dataIndex: "deduction_days",
      align: "center",
      render: (text, record) =>
        editingId === record.id ? (
          <Form.Item
            name="deduction_days"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Enter deduction days" }]}
          >
            <InputNumber min={0.5} max={31} step={0.5} style={{ width: "100%" }} />
          </Form.Item>
        ) : (
          <span>{text} day</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (text, record) =>
        editingId === record.id ? (
          <Form.Item name="status" style={{ margin: 0 }}>
            <Select style={{ width: "100%" }}>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        ) : (
          <Tag color={text === "Active" ? "green" : "red"}>{text}</Tag>
        ),
    },
    {
      title: "Actions",
      align: "center",
      width: 200,
      render: (_, record) =>
        editingId === record.id ? (
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="small"
              loading={loading}
              onClick={() => handleSave(record)}
            >
              Save
            </Button>
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>

            <ConfirmModal
              title="Delete Rule?"
              message="Are you sure you want to delete this rule?"
              onConfirm={() => deleteRule(record.id)}
              buttonText="Delete"
              icon={<DeleteOutlined />}
            />
          </Space>
        ),
    },
  ];

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      late_days_threshold: record.late_days_threshold,
      deduction_days: record.deduction_days,
      status: record.status,
    });
  };

  const handleSave = async (record) => {
    const values = await form.validateFields();
    await updateRule(record.id, values);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    form.resetFields();
  };

  const handleAdd = async () => {
    const newRule = await createRule({
      late_days_threshold: 1,
      deduction_days: 1,
      status: "Active",
    });

    setEditingId(newRule.id);

    form.setFieldsValue({
      late_days_threshold: newRule.late_days_threshold,
      deduction_days: newRule.deduction_days,
      status: newRule.status,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder} {/* IMPORTANT for notifications */}

      <Card
        title="Rules of Salary Deduction"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={editingId !== null}
            onClick={handleAdd}
          >
            Add New Rule
          </Button>
        }
      >
        <Row justify="space-between" style={{ marginBottom: 12 }}>
          <Col>
            <Input.Search
              placeholder="Search..."
              style={{ width: 300 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>

        <Form form={form} component={false}>
          <Table
            columns={columns}
            loading={loading}
            dataSource={filteredData}
            rowKey="id"
            bordered
            pagination={{
              current: currentPage,
              pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
            }}
          />
        </Form>
      </Card>
    </div>
  );
};

export default LateConfiguration;