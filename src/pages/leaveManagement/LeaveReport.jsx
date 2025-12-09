import { Card, Select, DatePicker, Button, Table } from "antd";
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
  ];

  return (
    <Card title="My Leave Report" className="page-card">
      <div className="flex gap-3 mb-4">
        {/* Employee Dropdown */}
        <Select
          placeholder="Employee Name"
          style={{ width: 200 }}
          value={filters.employee_id}
          onChange={(value) => setFilters({ ...filters, employee_id: value })}
          options={employees.map((emp) => ({
            label: emp.name,
            value: emp.user_id,
          }))}
        />

        {/* From Date */}
        <DatePicker
          placeholder="From Date"
          onChange={(date, dateStr) =>
            setFilters({ ...filters, from_date: dateStr })
          }
        />

        {/* To Date */}
        <DatePicker
          placeholder="To Date"
          onChange={(date, dateStr) =>
            setFilters({ ...filters, to_date: dateStr })
          }
        />

        <Button type="primary" onClick={handleFilter}>
          Filter
        </Button>
      </div>

      {/* Report Table */}
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
    </Card>
  );
};

export default LeaveReport;