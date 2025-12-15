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
      align: "left",
      render: (_, record) => record.training_type_name,
    },
    {
      title: "Training Duration",
      key: "duration",
      align: "center",
      render: (_, record) => `${record.from_date ?? ""} to ${record.to_date ?? ""}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
  ];

  return (
    <div className="table-page-container">
      <Card className="table-page-card" title="Training Report">
        <Row
          className="table-page-filters"
          gutter={16}
          style={{ marginBottom: 16 }}
          align="middle"
        >
          <Col>
            <Select
              placeholder="Select Employee"
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              style={{ width: 250 }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            >
              {employees.map((e) => (
                <Option key={e.user_id} value={e.user_id}>
                  {e.name}
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

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={reportData.map((t, i) => ({ ...t, key: t.id || i }))}
            loading={loading}
            pagination={{ pageSize: 10 }}
            size="middle"
            bordered
            scroll={{ x: 800 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default TrainingReport;