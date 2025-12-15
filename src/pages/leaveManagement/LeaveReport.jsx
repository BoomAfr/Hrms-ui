import { Card, Select, DatePicker, Button, Table, Row, Col } from "antd";
import { useLeaveReport } from "../../hooks/useLeaveReport";

const LeaveReport = () => {
  const {
    employees,
    reportData,
    filters,
    setFilters,
    loading,
    pagination,
    handleFilter,
    handlePageChange,
  } = useLeaveReport();

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Leave Type", dataIndex: "leave_type_name" },
    { title: "Applied Date", dataIndex: "application_date" },
    { title: "Request Duration", dataIndex: "request_duration" },
    { title: "Approve By", dataIndex: "approved_by_name" },
    { title: "Approve Date", dataIndex: "approved_date" },
    { title: "Purpose", dataIndex: "purpose" },
    { title: "Number of Day", dataIndex: "number_of_days" },
    { title: "Status", dataIndex: "status" },
  ];

  return (
    <div className="table-page-container">
      <Card title="Leave Report" className="table-page-card">
        <Row className="table-page-filters" gutter={12} align="middle">
          <Col>
            <Select
              placeholder="Employee Name"
              style={{ width: 200 }}
              value={filters.employee_id}
              onChange={(value) => setFilters({ ...filters, employee_id: value })}
              className="table-page-select"
              options={employees.map((emp) => ({
                label: emp.name,
                value: emp.user_id,
              }))}
            />
          </Col>

          <Col>
            <DatePicker
              placeholder="From Date"
              onChange={(date, dateStr) =>
                setFilters({ ...filters, from_date: dateStr })
              }
            />
          </Col>

          <Col>
            <DatePicker
              placeholder="To Date"
              onChange={(date, dateStr) =>
                setFilters({ ...filters, to_date: dateStr })
              }
            />
          </Col>

          <Col>
            <Button type="primary" onClick={handleFilter} className="table-page-add-btn">
              Filter
            </Button>
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={reportData}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: handlePageChange,
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default LeaveReport;