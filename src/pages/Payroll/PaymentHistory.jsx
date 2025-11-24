import React from "react";
import { Button, DatePicker, Table, Card, Row, Col } from "antd";
import dayjs from "dayjs";
import { usePaymentHistory } from "../../hooks/payroll/usePaymentHistory";

const PaymentHistory = () => {
  const { loading, month, setMonth, data, fetchPaymentHistory, totals } =
    usePaymentHistory();

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
    },
    {
      title: "Pay Grade",
      dataIndex: "pay_grade",
    },
    {
      title: "Net Salary",
      dataIndex: "net_salary",
      render: (v) => <span>₹{v}</span>,
    },
    {
      title: "To be Paid",
      dataIndex: "to_be_paid",
      render: (v) => <span>₹{v}</span>,
    },
  ];

  return (
    <Card title="Payment History" className="shadow-md rounded-lg">
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <DatePicker
            picker="month"
            format="MMMM YYYY"
            value={month ? dayjs(month) : null}
            onChange={(value) =>
              setMonth(value ? value.format("YYYY-MM") : null)
            }
            style={{ width: "100%" }}
          />
        </Col>

        <Col span={4}>
          <Button
            type="primary"
            onClick={fetchPaymentHistory}
            style={{ width: "100%" }}
          >
            Filter
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={false}
      />

      {data.length > 0 && (
        <Card style={{ marginTop: 20, fontSize: 16 }}>
          <Row>
            <Col span={12}>
              <strong>Total Net Salary: </strong>₹{totals.net_salary}
            </Col>
            <Col span={12}>
              <strong>Total To be Paid: </strong>₹{totals.to_be_paid}
            </Col>
          </Row>
        </Card>
      )}
    </Card>
  );
};

export default PaymentHistory;
