import React, { useMemo, useState } from "react";
import { Card, DatePicker, Button, Table, Spin } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAttendanceSummary } from "../../hooks/useAttendanceSummaryReport";

const AttendanceSummaryReport = () => {
  const [monthPicker, setMonthPicker] = useState(dayjs());
  const { loading, rows, dayCols, extraCols, fetchSummary } =
    useAttendanceSummary();

  // Compute weekday short names for each day column
  const dayHeaderMap = useMemo(() => {
    if (!monthPicker) return {};
    const year = monthPicker.year();
    const month = monthPicker.month();
    const map = {};
    const daysInMonth = monthPicker.daysInMonth();

    for (let d = 1; d <= daysInMonth; d++) {
      const date = dayjs(new Date(year, month, d));
      const key = String(d).padStart(2, "0");
      map[key] = date.format("ddd");
    }
    return map;
  }, [monthPicker]);

  // Dynamic table columns
  const columns = useMemo(() => {
    const cols = [
      {
        title: "S/L",
        key: "sl",
        width: 70,
        render: (_, __, index) => index + 1,
        fixed: "left",
      },
      {
        title: "Name",
        dataIndex: "Employee Name",
        key: "Employee Name",
        width: 180,
        fixed: "left",
      },
      {
        title: "Designation",
        dataIndex: "Designation",
        key: "Designation",
        width: 180,
      },
    ];

    dayCols.forEach((dayKey) => {
      const weekday = dayHeaderMap[dayKey] || "";
      cols.push({
        title: (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#666" }}>{weekday}</div>
            <div style={{ fontWeight: 600 }}>{dayKey}</div>
          </div>
        ),
        dataIndex: dayKey,
        key: dayKey,
        align: "center",
        width: 60,
        render: (val) => {
          if (!val || val === "--")
            return <span style={{ color: "#999" }}>--</span>;
          const v = String(val).toUpperCase();
          if (v === "P")
            return (
              <span style={{ color: "#28a745", fontWeight: 600 }}>{v}</span>
            );
          if (v === "A")
            return (
              <span style={{ color: "#e55353", fontWeight: 600 }}>{v}</span>
            );
          if (v === "L")
            return (
              <span style={{ color: "#f0ad4e", fontWeight: 600 }}>{v}</span>
            );
          return <span>{v}</span>;
        },
      });
    });

    extraCols.forEach((colKey) => {
      cols.push({
        title: colKey,
        dataIndex: colKey,
        key: colKey,
        width: 120,
        align: "center",
        render: (val) => (val == null || val === "" ? "-" : val),
      });
    });

    return cols;
  }, [dayCols, extraCols, dayHeaderMap]);

  const handleFilter = () => {
    fetchSummary(monthPicker.format("YYYY-MM"));
  };

  const handleDownloadPDF = () => {
    if (!rows || rows.length === 0) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("Attendance Summary Report", 40, 30);

    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text(`Month: ${monthPicker.format("YYYY - MMMM")}`, 40, 48);

    const header = ["#", "Name", "Designation", ...dayCols, ...extraCols];

    const body = rows.map((r, rowIndex) => {
      const row = [];
      row.push(rowIndex + 1);
      row.push(r["Employee Name"] || "-");
      row.push(r["Designation"] || "-");
      dayCols.forEach((d) => row.push(r[d] ?? "--"));
      extraCols.forEach((c) => row.push(r[c] ?? "-"));
      return row;
    });

    autoTable(doc, {
      startY: 70,
      head: [header],
      body,
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: {
        fillColor: [40, 116, 240],
        textColor: 255,
        fontStyle: "bold",
      },
      theme: "striped",
      margin: { left: 20, right: 20 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 80,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`attendance_summary_${monthPicker.format("YYYYMM")}.pdf`);
  };

  return (
    <div className="table-page-container">
      <Card
        className="table-page-card"
        title="Attendance Summary Report"
      >
        {/* FILTER SECTION */}
        <div
          className="table-page-filters"
          style={{ display: "flex", gap: 16, alignItems: "center" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: 600, marginBottom: 6 }}>Month</label>
            <DatePicker
              picker="month"
              value={monthPicker}
              onChange={(d) => setMonthPicker(d)}
            />
          </div>

          <Button type="primary" onClick={handleFilter}>
            Filter
          </Button>

          <Button
            className="table-page-add-btn"
            type="primary"
            style={{ marginLeft: "auto", background: "#28a745", borderColor: "#28a745" }}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
        </div>

        {/* TABLE */}
        <div className="table-page-table" style={{ minHeight: 120 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 30 }}>
              <Spin />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={rows}
              rowKey={(record, idx) =>
                record["Employee Name"] + "-" + idx
              }
              pagination={false}
              size="middle"
              bordered
              scroll={{ x: "max-content" }}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default AttendanceSummaryReport;