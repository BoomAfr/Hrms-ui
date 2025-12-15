import { Card, DatePicker, Button, Table } from "antd";
import { useMyAttendanceReport } from "../../hooks/useMyAttendanceReport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const MyAttendanceReport = () => {
  const {
    report,
    summary,
    filters,
    setFilters,
    loading,
    handleFilter,
  } = useMyAttendanceReport();

  const { user } = useSelector((state) => state.auth);

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

  // PDF generator (unchanged)
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

    doc.text("Summary", 40, doc.lastAutoTable.finalY + 30);

    const summaryRows = [
      ["Total Working Days", summary["Total Working Days"]],
      ["Total Present", summary["Total Present"]],
      ["Total Absent", summary["Total Absence"]],
      ["Total Leave", summary["Total Leave"]],
      ["Total Late", summary["Total Late"]],
      ["Expected Working Hours", summary["Expected Working Hour"]],
      ["Actual Working Hours", summary["Actual Working Hour"]],
      ["Over Time", summary["Over Time"]],
      ["Deficiency", summary["Deficiency"]],
    ];

    autoTable(doc, {
      body: summaryRows,
      theme: "plain",
      startY: doc.lastAutoTable.finalY + 50,
    });

    doc.save("my_attendance_report.pdf");
  };

  return (
    <div className="table-page-container">
      <Card className="table-page-card" title="My Attendance Report">
        {/* FILTER SECTION */}
        <div
          className="table-page-filters"
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          {/* EMPLOYEE NAME */}
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

          {/* Filter Button */}
          <Button type="primary" onClick={handleFilter} loading={loading}>
            Filter
          </Button>

          {/* PDF Button */}
          <Button
            style={{ marginLeft: "auto", background: "green", color: "#acff1d" }}
            onClick={downloadPDF}
          >
            Download PDF
          </Button>
        </div>

        {/* TABLE */}
        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={report.map((item) => ({
              date: item["Date"],
              in_time: item["In Time"],
              out_time: item["Out Time"],
              working_time: item["Working Time"],
              late: item["Late"],
              late_time: item["Late Time"],
              over_time: item["Over Time"],
              status: item["Status"],
            }))}
            loading={loading}
            pagination={false}
            rowKey={(record, index) => index}
          />
        </div>

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
                <tr><td><strong>Total Working Days:</strong></td><td>{summary["Total Working Days"]} Days</td></tr>
                <tr><td><strong>Total Present:</strong></td><td>{summary["Total Present"]} Days</td></tr>
                <tr><td><strong>Total Absent:</strong></td><td>{summary["Total Absence"]} Days</td></tr>
                <tr><td><strong>Total Leave:</strong></td><td>{summary["Total Leave"]} Days</td></tr>
                <tr><td><strong>Total Late:</strong></td><td>{summary["Total Late"]} Days</td></tr>
                <tr><td><strong>Expected Working Hours:</strong></td><td>{summary["Expected Working Hour"]} Hours</td></tr>
                <tr><td><strong>Actual Working Hours:</strong></td><td>{summary["Actual Working Hour"]} Hours</td></tr>
                <tr><td><strong>Over Time:</strong></td><td>{summary["Over Time"]} Hours</td></tr>
                <tr><td><strong>Deficiency:</strong></td><td>{summary["Deficiency"]} Hours</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyAttendanceReport;