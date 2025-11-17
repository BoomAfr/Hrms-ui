import { Card, DatePicker, Button, Table } from "antd";
import { useMyAttendanceReport } from "../../hooks/useMyAttendanceReport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

const MyAttendanceReport = () => {
  const {
    report,
    summary,
    filters,
    setFilters,
    loading,
    handleFilter,
  } = useMyAttendanceReport();

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const columns = [
    { title: "S/L", render: (_, __, index) => index + 1, width: 70 },
    { title: "Date", dataIndex: "date" },
    { title: "In Time", dataIndex: "in_time" },
    { title: "Out Time", dataIndex: "out_time" },
    { title: "Working Time", dataIndex: "working_time" },
    { title: "Late", dataIndex: "late" },
    { title: "Late Time", dataIndex: "late_time" },
    { title: "Over Time", dataIndex: "over_time" },
    { title: "Status", dataIndex: "status" },
  ];

  // PDF generator
  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    doc.setFontSize(16);
    doc.text(`My Attendance Report - ${user?.full_name}`, 40, 40);

    const tableColumn = [
      "S/L",
      "Date",
      "In Time",
      "Out Time",
      "Working Time",
      "Late",
      "Late Time",
      "Over Time",
      "Status",
    ];

    const tableRows = report.map((row, index) => [
      index + 1,
      row.date,
      row.in_time,
      row.out_time,
      row.working_time,
      row.late,
      row.late_time,
      row.over_time,
      row.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 70,
    });

    // Summary
    doc.text("Summary", 40, doc.lastAutoTable.finalY + 30);

    const summaryRows = [
      ["Total Working Days", summary.total_working_days],
      ["Total Present", summary.total_present],
      ["Total Absent", summary.total_absent],
      ["Total Leave", summary.total_leave],
      ["Total Late", summary.total_late],
      ["Expected Working Hours", summary.expected_working_hours],
      ["Actual Working Hours", summary.actual_working_hours],
      ["Over Time", summary.over_time],
      ["Deficiency", summary.deficiency],
    ];

    autoTable(doc, {
      body: summaryRows,
      theme: "plain",
      startY: doc.lastAutoTable.finalY + 50,
    });

    doc.save("my_attendance_report.pdf");
  };

  return (
    <Card title="My Attendance Report">
      {/* FILTER SECTION */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        {/* EMPLOYEE NAME (NO DROPDOWN) */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label><strong>Employee</strong></label>
          <div
            style={{
              width: 200,
              padding: "6px 10px",
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              background: "#fafafa",
            }}
          >
            {user?.full_name || "N/A"}
          </div>
        </div>

        {/* From Date */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label><strong>From Date</strong></label>
          <DatePicker
            style={{ width: 180 }}
            value={filters.from_date ? dayjs(filters.from_date) : null}
            onChange={(date, dateString) =>
              setFilters({ ...filters, from_date: dateString })
            }
          />
        </div>

        {/* To Date */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label><strong>To Date</strong></label>
          <DatePicker
            style={{ width: 180 }}
            value={filters.to_date ? dayjs(filters.to_date) : null}
            onChange={(date, dateString) =>
              setFilters({ ...filters, to_date: dateString })
            }
          />
        </div>

        {/* Filter button */}
        <Button type="primary" onClick={handleFilter} loading={loading}>
          Filter
        </Button>

        {/* PDF button */}
        <Button
          style={{ marginLeft: "auto", background: "green", color: "#acff1d" }}
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={report}
        loading={loading}
        pagination={false}
        rowKey={(record, index) => index}
      />

      {/* SUMMARY */}
      {summary && (
        <div
          style={{
            marginTop: 25,
            padding: 20,
            background: "#f7f7f7",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        >
          <h3>Summary</h3>
          <table style={{ width: "100%", lineHeight: "30px" }}>
            <tbody>
              <tr><td><strong>Total Working Days:</strong></td><td>{summary.total_working_days} Days</td></tr>
              <tr><td><strong>Total Present:</strong></td><td>{summary.total_present} Days</td></tr>
              <tr><td><strong>Total Absent:</strong></td><td>{summary.total_absent} Days</td></tr>
              <tr><td><strong>Total Leave:</strong></td><td>{summary.total_leave} Days</td></tr>
              <tr><td><strong>Total Late:</strong></td><td>{summary.total_late} Days</td></tr>
              <tr><td><strong>Expected Working Hours:</strong></td><td>{summary.expected_working_hours} Hours</td></tr>
              <tr><td><strong>Actual Working Hours:</strong></td><td>{summary.actual_working_hours} Hours</td></tr>
              <tr><td><strong>Over Time:</strong></td><td>{summary.over_time} Hours</td></tr>
              <tr><td><strong>Deficiency:</strong></td><td>{summary.deficiency} Hours</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default MyAttendanceReport;