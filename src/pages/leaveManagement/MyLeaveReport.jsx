import React from "react";
import { Card, Select, DatePicker, Button, Table } from "antd";
import { useMyLeaveReport } from "../../hooks/useMyLeaveReport";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";  

const MyLeaveReport = () => {
  const {
    reportData,
    loading,
    filters,
    setFilters,
    pagination,
    handleFilter,
    handlePageChange,
    savedUser,
  } = useMyLeaveReport();

  const columns = [
    {
      title: "S/L",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Leave Type", dataIndex: "leave_type" },
    { title: "Applied Date", dataIndex: "applied_date" },
    { title: "Request Duration", dataIndex: "request_duration" },
    { title: "Approve BY", dataIndex: "approved_by" },
    { title: "Approve Date", dataIndex: "approved_date" },
    { title: "Purpose", dataIndex: "purpose" },
    { title: "Number of Day", dataIndex: "day_count" },
  ];

  const handleDownloadPDF = () => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "A4",
  });

  // ---------- COMPANY HEADER ----------
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("My Leave Report", 40, 40);

  doc.setFontSize(11);
  doc.setFont("Helvetica", "normal");

  const today = new Date().toISOString().split("T")[0];

  doc.text(`Generated On: ${today}`, 40, 60);

  if (savedUser?.name) {
    doc.text(`Employee: ${savedUser.name}`, 40, 75);
  }

  // Add a line separator
  doc.setLineWidth(0.5);
  doc.line(40, 85, 555, 85);

  // ---------- TABLE ----------
  autoTable(doc, {
    startY: 100,

    head: [
      [
        "S/L",
        "Leave Type",
        "Applied Date",
        "Duration",
        "Approved By",
        "Approved Date",
        "Purpose",
        "Days",
      ],
    ],

    body: reportData.map((item, index) => [
      (pagination.current - 1) * pagination.pageSize + index + 1,
      item.leave_type ?? "-",
      item.applied_date ?? "-",
      item.request_duration ?? "-",
      item.approved_by ?? "-",
      item.approved_date ?? "-",
      item.purpose ?? "-",
      item.day_count ?? "-",
    ]),

    theme: "grid", // cleaner table

    styles: {
      fontSize: 10,
      cellPadding: 4,
      valign: "middle",
    },

    headStyles: {
      fillColor: [30, 144, 255], // modern blue header
      textColor: 255,
      fontSize: 11,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245], // light grey
    },

    margin: { left: 40, right: 40 },
  });

  // ---------- FOOTER ----------
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);

    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 70,
      doc.internal.pageSize.height - 20
    );
  }

  // Save the file
  doc.save("my_leave_report.pdf");
};

  // Prepare single-option employee dropdown: current logged-in user
  const employeeOptions = savedUser
    ? [
        {
          label: savedUser.name,
          value: savedUser.user_id,
        },
      ]
    : [];

  return (
    <Card title="My Leave Report">
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {/* Employee dropdown: single option (current user) and disabled */}
        <Select
          placeholder="Employee Name"
          style={{ width: 250 }}
          value={filters.employee_id}
          onChange={(value) => setFilters({ ...filters, employee_id: value })}
          options={employeeOptions}
          disabled={true}
        />

        {/* From Date */}
        <DatePicker
          placeholder="From Date"
          onChange={(date, dateString) =>
            setFilters({ ...filters, from_date: dateString })
          }
        />

        {/* To Date */}
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
        style={{ marginLeft: "auto", background: "blue", color: "#ffffffff" }} 
         onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={reportData}
        rowKey={(record, index) => record.id ?? index}
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

export default MyLeaveReport;