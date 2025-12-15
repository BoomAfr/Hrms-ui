import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Input,
  Space,
  Tag,
  Avatar,
  message,
  Modal,
  Form,
  Checkbox
} from "antd";
import { UserOutlined, PlusOutlined, PayCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSalarySheets, useMarkSalaryPaid } from "../../hooks/useSalary";

const { Title } = Typography;
const { Option } = Select;

const GenerateSalarySheet = () => {
  const navigate = useNavigate();

  // Default to current month
  const [filters, setFilters] = useState({
    month: dayjs().format('YYYY-MM'),
    status: null
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Payment Modal State
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();
  const [paymentType, setPaymentType] = useState(null); // 'single' or 'bulk'
  const [currentItemId, setCurrentItemId] = useState(null); // ID for single payment

  const { data, pagination, loading, fetchSalarySheets } = useSalarySheets(filters);
  const { markPaid, loading: paymentLoading } = useMarkSalaryPaid();

  useEffect(() => {
    fetchSalarySheets({ page: 1 });
  }, []); // Initial load

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchSalarySheets({ ...newFilters, page: 1 });
  };

  const handleMonthChange = (date, dateString) => {
    handleFilterChange('month', dateString);
  };

  const handleAction = (record) => {
    if (record.payslip_id) {
      // View Payslip
      navigate(`/app/payroll/salary/payslip/${record.payslip_id}`);
    } else {
      navigate('/app/salary/generate', { state: { employeeId: record.employee_id, month: filters.month } });
    }
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
        payment_type: 'salary',
        item_ids: itemIds, // Assuming item_ids expects logic for salary too
        payment_method: values.payment_method,
        payment_reference: values.payment_reference || '',
        payment_date: values.payment_date.format('YYYY-MM-DD')
      };

      await markPaid(payload, values.download_csv);
      message.success('Payment marked successfully');
      setIsPaymentModalVisible(false);
      setSelectedRowKeys([]);
      fetchSalarySheets({ ...filters, page: pagination.current });
    } catch (error) {
      // Error is handled by hook
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.status === 'Paid' || record.status === 'Pending', // Disable if paid or pending
    }),
  };

  const columns = [
    {
      title: "S/L",
      key: "sl",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Month",
      dataIndex: "month",
      render: () => dayjs(filters.month).format("MMMM YYYY"),
    },
    {
      title: "Photo",
      key: "photo",
      render: () => <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>ID: {record.employee_id || 'N/A'}</div>
        </div>
      )
    },
    {
      title: "Pay Grade",
      dataIndex: "pay_grade",
      key: "pay_grade",
    },

    {
      title: "Basic Salary",
      key: "basic_salary",
      render: () => "0",
    },
    {
      title: "Gross Salary",
      dataIndex: "gross_salary",
      key: "gross_salary",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = 'default';
        if (status === 'Paid') color = 'green';
        if (status === 'Calculated') color = 'blue';
        if (status === 'Pending') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.status === 'Calculated') {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => handleAction(record)}
              >
                View/Re-generate
              </Button>
              <Button
                type="primary"
                size="small"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={() => showPaymentModal('single', record.payslip_id)}
              >
                Make Payment
              </Button>
            </Space>
          );
        }

        if (record.status === 'Paid') {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => handleAction(record)}
            >
              View Payslip
            </Button>
          );
        }

        // Pending or no payslip_id
        return (
          <span style={{ color: '#faad14', fontSize: '12px' }}>
            Generate Salary Sheet First
          </span>
        );
      },
    },
  ];

  return (
    <div className="table-page-container">

      {/* Top Buttons - Responsive Wrapper */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '16px',
        gap: '8px',
        flexWrap: 'wrap' // Allow wrapping on small screens
      }}>
        {selectedRowKeys.length > 0 && (
          <Button
            type="primary"
            style={{ backgroundColor: "#faad14", borderColor: "#faad14", color: "white" }}
            onClick={() => showPaymentModal('bulk')}
            icon={<PayCircleOutlined />}
          >
            Bulk Pay ({selectedRowKeys.length})
          </Button>
        )}
        <Button
          type="primary"
          className="table-page-add-btn"
          onClick={() => navigate('/app/salary/generate-bulk')}
          icon={<PlusOutlined />}
        >
          Generate Bulk Salary Sheet
        </Button>
        <Button
          type="primary"
          className="table-page-add-btn"
          icon={<PlusOutlined />}
          onClick={() => navigate('/app/salary/generate')}
        >
          Generate Single Salary Sheet
        </Button>
      </div>

      <Card
        className="table-page-card"
        title="Payment Info"
      >
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={8}>
            <Title level={5}>Month</Title>
            <DatePicker
              picker="month"
              format="YYYY-MM"
              allowClear={false}
              value={dayjs(filters.month)}
              onChange={handleMonthChange}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={5}>Status</Title>
            <Select
              placeholder="---- Please Select ----"
              style={{ width: "100%" }}
              allowClear
              onChange={(val) => handleFilterChange('status', val)}
            >
              <Option value="Pending">Pending Calculation</Option>
              <Option value="Calculated">Ready for Payment</Option>
              <Option value="Paid">Paid</Option>
            </Select>
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.payslip_id || record.employee_id} // Pref payslip_id for payment, fallback for unique key
            pagination={{
              ...pagination,
              onChange: (page, pageSize) => fetchSalarySheets({ page, pageSize })
            }}
            bordered
            scroll={{ x: 1000 }} // Enable horizontal scroll for table
          />
        </div>
      </Card>

      {/* Payment Modal */}
      <Modal
        title="Mark Salary as Paid"
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        footer={null}
      >
        <Form
          form={paymentForm}
          layout="vertical"
          onFinish={handlePaymentSubmit}
          initialValues={{ download_csv: false }}
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

export default GenerateSalarySheet;
