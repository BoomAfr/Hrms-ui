import React, { useState } from "react";
import { Card, Table, Select, Row, Col, Button } from "antd";
import { useTrainingReport } from "../../hooks/useTrainingReport";

const { Option } = Select;

const TrainingReport = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { reportData, employees, loading, fetchReport } = useTrainingReport();

  const handleFilter = () => {
    if (selectedEmployee) {
      fetchReport(selectedEmployee);
    }
  };

  const columns = [
    {
      title: "S/L",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Training Type",
      dataIndex: "training_type_name",
      key: "training_type_name",
      render: (_, record) => record.training_type_name ?? record.training_type?.training_type_name ?? record.training_type?.name,
    },
    {
      title: "Training Duration",
      key: "duration",
      render: (_, record) => `${record.from_date ?? ""} to ${record.to_date ?? ""}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Training Report">
        <Row gutter={16} style={{ marginBottom: 16 }} align="middle">
          <Col>
            <Select
              placeholder="Select Employee"
              value={selectedEmployee}
              onChange={(value) => setSelectedEmployee(value)}
              style={{ width: 250}}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((e) => (
                <Option key={e.id} value={e.id}>
                  {e.name ?? e.employee_name ?? `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim()}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={reportData.map((t, i) => ({ ...t, key: t.id || i }))}
          loading={loading}
          pagination={{ pageSize: 10 }}
          size="middle"
          bordered
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default TrainingReport;