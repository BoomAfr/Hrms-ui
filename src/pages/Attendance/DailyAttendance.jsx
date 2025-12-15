import React from "react";
import { Card, DatePicker, Button, Spin } from "antd";
import dayjs from "dayjs";
import { useDailyAttendance } from "../../hooks/useDailyAttendance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DailyAttendance = () => {
  const {
    date,
    setDate,
    loading,
    groupedByDept,
    pagination,
    handleFilter,
  } = useDailyAttendance();

  // Professional PDF exporter
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFontSize(18);
    doc.setFont("Helvetica", "bold");
    doc.text("Daily Attendance Report", 40, 40);

    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text(`Date: ${date}`, 40, 60);
    doc.text(`Generated On: ${dayjs().format("YYYY-MM-DD")}`, 40, 76);

    doc.setLineWidth(0.5);
    doc.line(40, 84, 555, 84);

    const tableCols = [
      "S/L",
      "Date",
      "Employee Name",
      "In Time",
      "Out Time",
      "Working Time",
      "Late",
      "Late Time",
      "Over Time",
    ];

    const body = [];
    let globalCounter = 1;

    Object.keys(groupedByDept).forEach((dept) => {
      body.push([
        {
          content: dept,
          colSpan: 9,
          styles: {
            halign: "left",
            fillColor: [230, 230, 230],
            textColor: 20,
            fontStyle: "bold",
          },
        },
      ]);

      (groupedByDept[dept] || []).forEach((r) => {
        body.push([
          globalCounter++,
          r.date ?? date,
          r.employee_name ?? r.name ?? "-",
          r.in_time ?? "-",
          r.out_time ?? "-",
          r.working_time ?? r.working_time_text ?? r.working_time_display ?? "-",
          typeof r.late === "boolean" ? (r.late ? "Yes" : "No") : r.late ?? "-",
          r.late_time ?? "-",
          r.over_time ?? "-",
        ]);
      });
    });

    autoTable(doc, {
      startY: 100,
      head: [tableCols],
      body,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: {
        fillColor: [40, 116, 240],
        textColor: 255,
        fontStyle: "bold",
      },
      didParseCell: function (data) {
        if (
          data.section === "body" &&
          Array.isArray(data.row.raw) &&
          data.row.raw.length === 1 &&
          data.row.raw[0].colSpan
        ) {
          if (data.column.index === 0) {
            data.cell.colSpan = 9;
            data.cell.styles.fillColor = [245, 245, 245];
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.halign = "left";
          } else {
            data.cell.text = "";
          }
        }
      },
      margin: { left: 40, right: 40 },
      pageBreak: "auto",
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 80,
        doc.internal.pageSize.height - 20
      );
    }

    doc.save(`daily_attendance_${date}.pdf`);
  };

  return (
    <div className="table-page-container">
      <Card title="Daily Attendance" className="table-page-card">
        {/* FILTER BAR */}
        <div
          className="table-page-filters"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Date</div>
            <DatePicker
              value={date ? dayjs(date) : undefined}
              onChange={(d, dStr) => setDate(dStr)}
              allowClear={false}
              style={{ minWidth: 180 }}
              size="middle"
            />
          </div>

          <Button
            type="primary"
            className="table-page-add-btn"
            onClick={handleFilter}
          >
            Filter
          </Button>

          <div style={{ marginLeft: "auto" }}>
            <Button
              type="primary"
              style={{ background: "#28a745", borderColor: "#28a745" }}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-page-table" style={{ minHeight: 120 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin />
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                }}
              >
                <thead>
                  <tr style={{ background: "#f5f7fa" }}>
                    {[
                      "S/L",
                      "Date",
                      "Employee Name",
                      "In Time",
                      "Out Time",
                      "Working Time",
                      "Late",
                      "Late Time",
                      "Over Time",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: 12,
                          border: "1px solid #eee",
                          textAlign: "left",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(groupedByDept).length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: 20, textAlign: "center" }}>
                        No records found
                      </td>
                    </tr>
                  )}

                  {Object.entries(groupedByDept).map(([dept, rows]) => (
                    <React.Fragment key={dept}>
                      <tr>
                        <td
                          colSpan={9}
                          style={{
                            padding: "10px 12px",
                            background: "#f0f4f8",
                            fontWeight: 700,
                          }}
                        >
                          {dept}
                        </td>
                      </tr>

                      {rows.map((r, idx) => (
                        <tr key={r.id ?? `${dept}-${idx}`}>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>{idx + 1}</td>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>{r.date ?? date}</td>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>{r.employee_name ?? r.name ?? "-"}</td>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>{r.in_time ?? "-"}</td>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>{r.out_time ?? "-"}</td>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>{r.working_time ?? "-"}</td>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>
                            {typeof r.late === "boolean" ? (r.late ? "Yes" : "No") : r.late ?? "-"}
                          </td>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>{r.late_time ?? "-"}</td>
                          <td style={{ padding: 12, border: "1px solid #f0f0f0" }}>{r.over_time ?? "-"}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DailyAttendance;