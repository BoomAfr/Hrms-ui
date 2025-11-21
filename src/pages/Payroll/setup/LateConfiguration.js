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
  message,
  Form,
  Tag
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  SaveOutlined,
  CloseOutlined 
} from "@ant-design/icons";

const { Option } = Select;

const LateConfiguration = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual API data
  const [rulesData, setRulesData] = useState([
    {
      id: 1,
      forDays: 8,
      dayOfSalaryDeduction: 1,
      status: "Active",
    },
  ]);

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
      title: "For Days",
      dataIndex: "forDays",
      key: "forDays",
      align: "center",
      render: (text, record) => 
        editingId === record.id ? (
          <Form.Item
            name="forDays"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please enter days' }]}
          >
            <InputNumber 
              min={1} 
              max={31}
              placeholder="Enter days"
              style={{ width: '100%' }}
            />
          </Form.Item>
        ) : (
          <span>{text} days</span>
        )
    },
    {
      title: "Day of Salary Deduction",
      dataIndex: "dayOfSalaryDeduction",
      key: "dayOfSalaryDeduction",
      align: "center",
      render: (text, record) => 
        editingId === record.id ? (
          <Form.Item
            name="dayOfSalaryDeduction"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please enter deduction days' }]}
          >
            <InputNumber 
              min={1} 
              max={31}
              placeholder="Enter deduction days"
              style={{ width: '100%' }}
            />
          </Form.Item>
        ) : (
          <span>{text} day{text > 1 ? 's' : ''}</span>
        )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record) => 
        editingId === record.id ? (
          <Form.Item
            name="status"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status" style={{ width: '100%' }}>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        ) : (
          <Tag color={text === "Active" ? "green" : "red"}>
            {text}
          </Tag>
        )
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {editingId === record.id ? (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<SaveOutlined />}
                onClick={() => handleSave(record)}
                loading={loading}
              >
                Save
              </Button>
              <Button 
                size="small" 
                icon={<CloseOutlined />}
                onClick={() => handleCancel()}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              type="primary" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      forDays: record.forDays,
      dayOfSalaryDeduction: record.dayOfSalaryDeduction,
      status: record.status,
    });
  };

  const handleSave = async (record) => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // API call to update the rule
      const updatedData = {
        ...record,
        forDays: values.forDays,
        dayOfSalaryDeduction: values.dayOfSalaryDeduction,
        status: values.status,
      };

      // Replace with actual API call
      console.log("Updating rule:", updatedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setRulesData(prev => 
        prev.map(item => 
          item.id === record.id ? updatedData : item
        )
      );

      message.success("Rule updated successfully");
      setEditingId(null);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Please fill all required fields correctly");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    form.resetFields();
  };

  const handleAddNew = () => {
    const newRule = {
      id: Date.now(),
      forDays: 1,
      dayOfSalaryDeduction: 1,
      status: "Active",
    };
    
    setRulesData(prev => [...prev, newRule]);
    setEditingId(newRule.id);
    form.setFieldsValue({
      forDays: 1,
      dayOfSalaryDeduction: 1,
      status: "Active",
    });
  };

  const filteredData = rulesData.filter(rule =>
    rule.status.toLowerCase().includes(searchText.toLowerCase()) ||
    rule.forDays.toString().includes(searchText) ||
    rule.dayOfSalaryDeduction.toString().includes(searchText)
  );

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Rules of Salary Deduction"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            disabled={editingId !== null}
          >
            Add New Rule
          </Button>
        }
      >
        <Row style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <Input.Search
              placeholder="Search rules..."
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Form form={form} component={false}>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              pageSize: pageSize,
              current: currentPage,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} rules`,
            }}
            size="middle"
            bordered
            scroll={{ x: 800 }}
          />
        </Form>
      </Card>
    </div>
  );
};

export default LateConfiguration;