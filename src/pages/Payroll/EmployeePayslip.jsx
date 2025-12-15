import React, { useRef } from "react";
import {
  Card,
  Button,
  Typography,
  Descriptions,
  Table,
  Divider,
  Row,
  Col,
  Spin,
  message
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { usePayslip } from "../../hooks/useSalary";

const { Title, Text } = Typography;

const EmployeePayslip = () => {
  const { id } = useParams();
  const { payslip, loading, error } = usePayslip(id);
  const componentRef = useRef();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading payslip..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (!payslip) {
    return null;
  }


  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="table-page-container" ref={componentRef}>
      <Card
        className="table-page-card"
        title="Employee Payslip"
        extra={
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            className="table-page-add-btn"
          >
            Download PDF
          </Button>
        }
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={4} style={{ textTransform: "uppercase" }}>Salary Sheet/ Final Balance</Title>
        </div>

        <Descriptions bordered column={1} labelStyle={{ width: '30%', fontWeight: 'bold' }}>
          <Descriptions.Item label="Month">
            {dayjs(payslip.payment_month).format("MMMM YYYY")}
          </Descriptions.Item>

          <Descriptions.Item label="Name">
            {payslip.employee_name}
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            {payslip.department}
          </Descriptions.Item>
          <Descriptions.Item label="Designation">
            {payslip.designation}
          </Descriptions.Item>

          <Descriptions.Item label="Working Days">
            {payslip.working_days} Days
          </Descriptions.Item>
          <Descriptions.Item label="Total Days">
            {payslip.total_days_in_month} Days
          </Descriptions.Item>


          <Descriptions.Item label="Basic Salary">
            {payslip.basic_salary}
          </Descriptions.Item>


          {payslip.allowance_breakdown && payslip.allowance_breakdown.length > 0 && (
            <Descriptions.Item label="Allowances">
              {payslip.allowance_breakdown.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                  <span>{item.item_name}:</span> <span>{item.amount}</span>
                </div>
              ))}
            </Descriptions.Item>
          )}

          {payslip.total_overtime_pay > 0 && (
            <Descriptions.Item label="Overtime Pay">
              {payslip.total_overtime_pay}
            </Descriptions.Item>
          )}

          {payslip.deduction_breakdown && payslip.deduction_breakdown.length > 0 && (
            <Descriptions.Item label="Deductions">
              {payslip.deduction_breakdown.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                  <span>{item.item_name}:</span> <span>{item.amount}</span>
                </div>
              ))}
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Gross Salary">
            <Text strong>{payslip.gross_salary}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Net Salary (Payable)">
            <Text strong style={{ fontSize: '1.2em' }}>{payslip.net_salary}</Text>
          </Descriptions.Item>


        </Descriptions>

        <br /><br /><br />

        <Row justify="space-between" style={{ marginTop: "50px", textAlign: "center" }}>
          <Col span={6}>
            <Divider style={{ borderColor: "black" }} />
            <Text strong>Administrator Signature</Text>
          </Col>
          <Col span={6}>
            <Text strong>Date: {dayjs().format('DD-MMM-YYYY')}</Text>
          </Col>
          <Col span={6}>
            <Divider style={{ borderColor: "black" }} />
            <Text strong>Employee Signature</Text>
          </Col>
        </Row>

      </Card>
    </div>
  );
};

export default EmployeePayslip;
