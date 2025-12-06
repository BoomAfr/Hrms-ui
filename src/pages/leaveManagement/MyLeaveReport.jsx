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
    filterApplied,
  } = useMyLeaveReport();

  const columns = [
    {
      title: "S/L",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Leave Type", dataIndex: "leave_type_name" },
    { title: "Applied Date", dataIndex: "application_date" },
    { title: "Request Duration", dataIndex: "request_duration" },
    { title: "Approve BY", dataIndex: "approved_by_name" },
    { title: "Approve Date", dataIndex: "approved_date" },
    { title: "Purpose", dataIndex: "purpose" },
    { title: "Number of Day", dataIndex: "number_of_days" },
  ];

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "A4" });

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

    doc.setLineWidth(0.5);
    doc.line(40, 85, 555, 85);

    autoTable(doc, {
      startY: 100,
      head: [["S/L","Leave Type","Applied Date","Duration","Approved By","Approved Date","Purpose","Days"]],
      body: reportData.map((item, index) => [
        (pagination.current - 1) * pagination.pageSize + index + 1,
        item.leave_type_name ?? "-",
        item.application_date ?? "-",
        item.request_duration ?? "-",
        item.approved_by_name ?? "-",
        item.approved_date ?? "-",
        item.purpose ?? "-",
        item.number_of_days ?? "-",
      ]),
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 4, valign: "middle" },
      headStyles: { fillColor: [30, 144, 255], textColor: 255, fontSize: 11, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 40, right: 40 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 70, doc.internal.pageSize.height - 20);
    }

    doc.save("my_leave_report.pdf");
  };

  const employeeOptions = savedUser ? [{ label: savedUser.name, value: savedUser.user_id }] : [];

  return (
    <Card title="My Leave Report">
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Select
          placeholder="Employee Name"
          style={{ width: 250 }}
          value={filters.employee_id}
          onChange={(value) => setFilters({ ...filters, employee_id: value })}
          options={employeeOptions}
          disabled={true}
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

        <Button type="primary" onClick={handleFilter}>Filter</Button>

        <Button
          style={{ marginLeft: "auto", background: "blue", color: "#ffffffff" }}
          onClick={handleDownloadPDF}
          disabled={!filterApplied || reportData.length === 0}
        >
          Download PDF
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filterApplied ? reportData : []}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={filterApplied ? {
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        } : false}
      />
    </Card>
  );
};

export default MyLeaveReport;