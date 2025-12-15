import { Card, Select, DatePicker, Button, Table, Row, Col } from "antd";
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
      align: "center",
      width: 70,
    },
    { title: "Leave Type", dataIndex: "leave_type", align: "center" },
    { title: "Number of Day", dataIndex: "number_of_day", align: "center" },
    { title: "Leave Consume", dataIndex: "leave_consume", align: "center" },
    { title: "Current Balance", dataIndex: "current_balance", align: "center" },
  ];

  // DOWNLOAD PDF FUNCTION (UNCHANGED)
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
    <div className="table-page-container">
      <Card title="Summary Report" className="table-page-card">
        {/* FILTERS */}
        <Row gutter={12} className="table-page-filters">
          <Col>
            <Select
              placeholder="Employee Name"
              className="table-page-select"
              value={filters.employee_id}
              onChange={(value) =>
                setFilters({ ...filters, employee_id: value })
              }
              options={employees.map((emp) => ({
                label: emp.name,
                value: emp.user_id,
              }))}
            />
          </Col>

          <Col>
            <DatePicker
              placeholder="From Date"
              className="table-page-date"
              onChange={(date, dateString) =>
                setFilters({ ...filters, from_date: dateString })
              }
            />
          </Col>

          <Col>
            <DatePicker
              placeholder="To Date"
              className="table-page-date"
              onChange={(date, dateString) =>
                setFilters({ ...filters, to_date: dateString })
              }
            />
          </Col>

          <Col>
            <Button
              type="primary"
              className="table-page-add-btn"
              onClick={handleFilter}
            >
              Filter
            </Button>
          </Col>

          <Col flex="auto" />

          <Col>
            <Button
              className="table-page-add-btn"
              style={{ background: "green", color: "#acff1dff" }}
              onClick={downloadPDF}
            >
              Download PDF
            </Button>
          </Col>
        </Row>

        {/* TABLE */}
        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={summary}
            rowKey={(record, index) => index}
            loading={loading}
            pagination={false}
            bordered
          />
        </div>
      </Card>
    </div>
  );
};

export default LeaveSummaryReport;