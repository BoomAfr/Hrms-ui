import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Space, message, Tag, Modal, Form, DatePicker, Row, Col, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, SearchOutlined, DollarOutlined, PayCircleOutlined } from "@ant-design/icons";
import { useEmployeeBonuses, useMarkBonusPaid } from "../../hooks/useBonus";
import dayjs from "dayjs";

const { Option } = Select;

const GenerateBonus = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Payment Modal State
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();
  const [paymentType, setPaymentType] = useState(null); // 'single' or 'bulk'
  const [currentItemId, setCurrentItemId] = useState(null); // ID for single payment

  const { bonuses, pagination, loading, refetch } = useEmployeeBonuses(filters);
  const { markPaid, loading: paymentLoading } = useMarkBonusPaid();

  useEffect(() => {
    refetch({ page: currentPage, pageSize });
  }, [currentPage, pageSize, filters]);

  const handleSearch = (value) => {
    setSearchText(value);
    setFilters({ ...filters, search: value });
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleTableChange = (paginationConfig) => {
    setCurrentPage(paginationConfig.current);
  };

  const handleAddBonus = () => {
    navigate('/payroll/add-generate-bonus');
  };

  // Payment Handlers
  const showPaymentModal = (type, id = null) => {
    setPaymentType(type);
    setCurrentItemId(id);
    paymentForm.resetFields();
    paymentForm.setFieldsValue({ payment_date: dayjs() });
    setIsPaymentModalVisible(true);
  };

  const handlePaymentSubmit = async (values) => {
    try {
      let itemIds = [];
      if (paymentType === 'single' && currentItemId) {
        itemIds = [currentItemId];
      } else if (paymentType === 'bulk') {
        itemIds = selectedRowKeys;
      }

      const payload = {
        payment_type: 'bonus',
        item_ids: itemIds,
        payment_method: values.payment_method,
        payment_reference: values.payment_reference || '',
        payment_date: values.payment_date.format('YYYY-MM-DD')
      };

      await markPaid(payload, values.download_csv);
      message.success('Payment marked successfully');
      setIsPaymentModalVisible(false);
      setSelectedRowKeys([]);
      refetch({ page: currentPage, pageSize });
    } catch (error) {
      // Error is handled by hook/toast usually, but we can show message here if needed
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.status === 'Paid', // Disable selection for already paid rows
    }),
  };

  const columns = [
    {
      title: "S/L",
      key: "sl",
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Month",
      dataIndex: "bonus_month",
      key: "bonus_month",
      render: (date) => dayjs(date).format('MMMM YYYY'),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (value) => value || 'N/A',
    },
    {
      title: "Festival Name",
      dataIndex: "festival_name",
      key: "festival_name",
    },
    {
      title: "Bonus Amount",
      dataIndex: "bonus_amount",
      key: "bonus_amount",
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 'Paid' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<DollarOutlined />}
          disabled={record.status === 'Paid'}
          onClick={() => showPaymentModal('single', record.id)}
          style={{
            backgroundColor: record.status === 'Paid' ? '#d9d9d9' : '#52c41a',
            borderColor: record.status === 'Paid' ? '#d9d9d9' : '#52c41a'
          }}
        >
          {record.status === 'Paid' ? 'Paid' : 'Pay'}
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Space>
          <span>Show</span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 80 }}
          >
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
            <Option value={50}>50</Option>
            <Option value={100}>100</Option>
          </Select>
          <span>entries</span>
        </Space>

        <Space>
          <Input
            placeholder="Search by name or festival"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          {selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              onClick={() => showPaymentModal('bulk')}
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
              icon={<PayCircleOutlined />}
            >
              Bulk Pay ({selectedRowKeys.length})
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddBonus}
          >
            Generate Bonus
          </Button>
        </Space>
      </div>


      <Table
        rowSelection={rowSelection}
        bordered
        dataSource={bonuses}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: pagination.total,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} bonuses`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />

      {/* Payment Modal */}
      <Modal
        title="Mark Bonus as Paid"
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        footer={null}
      >
        <Form
          form={paymentForm}
          layout="vertical"
          onFinish={handlePaymentSubmit}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="payment_method"
                label="Payment Method"
                rules={[{ required: true, message: 'Please select payment method' }]}
              >
                <Select placeholder="Select Method">
                  <Option value="Manual">Manual</Option>
                  <Option value="Cash">Cash</Option>
                  <Option value="Bank Transfer">Bank Transfer</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="payment_date"
                label="Payment Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="payment_reference"
                label="Reference / Transaction ID"
              >
                <Input placeholder="Optional reference number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="download_csv"
                valuePropName="checked"
              >
                <Checkbox>Download Payment CSV Receipt</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Space style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button onClick={() => setIsPaymentModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={paymentLoading}>
              Confirm Payment
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default GenerateBonus;
