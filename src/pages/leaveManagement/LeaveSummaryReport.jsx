import { Card, Select, DatePicker, Button, Table } from "antd";
import { useLeaveSummaryReport } from "../../hooks/useLeaveSummaryReport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LeaveSummaryReport = () => {
  const {
    employees,
    summary,
    filters,
    setFilters,
    loading,
    handleFilter,
  } = useLeaveSummaryReport();

  const columns = [
    {
      title: "S/L",
      render: (_, __, index) => index + 1,
    },
    { title: "Leave Type", dataIndex: "leave_type" },
    { title: "Number of Day", dataIndex: "number_of_day" },
    { title: "Leave Consume", dataIndex: "leave_consume" },
    { title: "Current Balance", dataIndex: "current_balance" },
  ];

  // DOWNLOAD PDF FUNCTION
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Summary Report", 14, 10);

    const tableColumn = [
      "S/L",
      "Leave Type",
      "Number of Day",
      "Leave Consume",
      "Current Balance",
    ];

    const tableRows = summary.map((row, index) => [
      index + 1,
      row.leave_type,
      row.number_of_day,
      row.leave_consume,
      row.current_balance,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("summary_report.pdf");
  };

  return (
    <Card title="Summary Report">
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        
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

        
        <DatePicker
          placeholder="From Date"
          onChange={(date, dateString) =>
            setFilters({ ...filters, from_date: dateString })
          }
        />

        
        <DatePicker
          placeholder="To Date"
          onChange={(date, dateString) =>
            setFilters({ ...filters, to_date: dateString })
          }
        />

        <Button type="primary" onClick={handleFilter}>
          Filter
        </Button>

        
        <Button
          style={{ marginLeft: "auto", background: "green", color: "#acff1dff" }}
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={summary}
        rowKey={(record, index) => index}
        loading={loading}
        pagination={false}
      />
    </Card>
  );
};

export default LeaveSummaryReport;
