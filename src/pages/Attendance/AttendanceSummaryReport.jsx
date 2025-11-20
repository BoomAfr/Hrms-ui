import React, { useMemo, useState } from "react";
import { Card, DatePicker, Button, Table, Spin } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAttendanceSummary } from "../../hooks/useAttendanceSummaryReport";


const AttendanceSummaryReport = () => {
  const [monthPicker, setMonthPicker] = useState(dayjs()); // default to current month
  const { loading, rows, dayCols, extraCols, monthStr, fetchSummary } = useAttendanceSummary();

  // Compute weekday short names for each day column (Mon, Tue...)
  const dayHeaderMap = useMemo(() => {
    if (!monthPicker) return {};
    const year = monthPicker.year();
    const month = monthPicker.month(); // 0-indexed
    const map = {};
    const daysInMonth = monthPicker.daysInMonth();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = dayjs(new Date(year, month, d));
      const key = String(d).padStart(2, "0");
      map[key] = date.format("ddd"); // Mon, Tue, ...
    }
    return map;
  }, [monthPicker]);

  // Build AntD table columns dynamically
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

    // add day columns (01..NN)
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
        // simple cell render to color-code statuses
        render: (val) => {
          if (!val || val === "--") return <span style={{ color: "#999" }}>--</span>;
          const v = String(val).toUpperCase();
          if (v === "P") return <span style={{ color: "#28a745", fontWeight: 600 }}>{v}</span>;
          if (v === "A") return <span style={{ color: "#e55353", fontWeight: 600 }}>{v}</span>;
          if (v === "L") return <span style={{ color: "#f0ad4e", fontWeight: 600 }}>{v}</span>;
          return <span>{v}</span>;
        },
      });
    });

    // add any extra summary columns (Day off worked, Gov. Day Worked, Earn Leave, etc.)
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

  // table data: rows are already objects from backend
  const dataSource = rows;

  // handler - click filter
  const handleFilter = () => {
    const m = monthPicker.format("YYYY-MM");
    fetchSummary(m);
  };

  // PDF generator
  const handleDownloadPDF = () => {
    if (!rows || rows.length === 0) {
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    // Title
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("Attendance Summary Report", 40, 30);

    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text(`Month: ${monthPicker.format("YYYY - MMMM")}`, 40, 48);

    // Build header row array for autoTable: Name, Designation, day columns, extras
    const header = ["#", "Name", "Designation", ...dayCols, ...extraCols];

    // Build body rows
    const body = rows.map((r, rowIndex) => {
      const row = [];
      row.push(rowIndex + 1);
      row.push(r["Employee Name"] || r["name"] || "-");
      row.push(r["Designation"] || "-");
      dayCols.forEach((d) => {
        const v = r[d] == null ? "--" : r[d];
        row.push(v);
      });
      extraCols.forEach((c) => row.push(r[c] == null ? "-" : r[c]));
      return row;
    });

    autoTable(doc, {
      startY: 70,
      head: [header],
      body,
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [40, 116, 240], textColor: 255, fontStyle: "bold" },
      theme: "striped",
      margin: { left: 20, right: 20 },
      didDrawCell: function (data) {
        // optionally color code P/A/L in body
        if (data.section === "body" && data.column.index >= 3 && data.cell && data.cell.text) {
          const txt = String(data.cell.text).trim().toUpperCase();
          if (txt === "P") {
            data.cell.styles.textColor = [40, 160, 70];
            data.cell.styles.fontStyle = "bold";
          } else if (txt === "A") {
            data.cell.styles.textColor = [230, 80, 80];
            data.cell.styles.fontStyle = "bold";
          } else if (txt === "L") {
            data.cell.styles.textColor = [240, 160, 40];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    // Footer page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 80, doc.internal.pageSize.height - 10);
    }

    doc.save(`attendance_summary_${monthPicker.format("YYYYMM")}.pdf`);
  };

  return (
    <Card title="Attendance Summary Report">
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: 600, marginBottom: 6 }}>Month</label>
          <DatePicker picker="month" value={monthPicker} onChange={(d) => setMonthPicker(d)} />
        </div>

        <Button type="primary" onClick={handleFilter}>Filter</Button>

        <div style={{ marginLeft: "auto" }}>
          <Button type="primary" style={{ background: "#28a745", borderColor: "#28a745" }} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      <div style={{ minHeight: 120 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 30 }}><Spin /></div>
        ) : (
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={(record, idx) => record["Employee Name"] + "-" + idx}
            pagination={false}
            size="middle"
            bordered
            scroll={{ x: "max-content" }}
          />
        )}
      </div>
    </Card>
  );
};

export default AttendanceSummaryReport;
