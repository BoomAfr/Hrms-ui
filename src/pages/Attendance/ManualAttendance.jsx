import React, { useEffect, useState } from "react";
import { Row, Col, Select, DatePicker, Button, Table, TimePicker, message, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useManualAttendance } from "../../hooks/useManualAttendance";
import CSVAttendanceModal from "../../components/common/SharedModal/CsvAttendanceModal";

const { Option } = Select;

export default function ManualAttendancePage() {
  const {
    departments,
    loadingDepartments,
    fetchDepartments,
    attendanceRows,
    loadingAttendance,
    fetchAttendance,
    updateRowLocal,
    saveAttendanceBatch,
  } = useManualAttendance();

  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment()); // default today
  const [showCSVModal, setShowCSVModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFilter = () => {
    if (!selectedDept) return message.error("Please select a department");
    if (!selectedDate) return message.error("Please select a date");
    fetchAttendance({ department_id: selectedDept, target_date: selectedDate.format("YYYY-MM-DD") });
  };

  const handleSave = async () => {
    if (!selectedDate) return message.error("Please select a date before saving");
    if (!selectedDept) return message.error("Please select a department before saving");

    // Validate times locally: punch_out > punch_in if both present
    for (const r of attendanceRows) {
      if (r.punch_in_time && r.punch_out_time) {
        const inT = moment(r.punch_in_time, "HH:mm:ss");
        const outT = moment(r.punch_out_time, "HH:mm:ss");
        if (!outT.isAfter(inT)) {
          return message.error(`Out Time must be after In Time for ${r.employee_name} (${r.fingerprint_no})`);
        }
      }
    }

    const payload = attendanceRows.map((r) => ({
      employee_id: r.employee_id,
      target_date: selectedDate.format("YYYY-MM-DD"),
      // null when empty so backend can treat accordingly
      punch_in_time: r.punch_in_time || null,
      punch_out_time: r.punch_out_time || null,
      is_present: !!r.punch_in_time, // simple heuristic; backend uses business rules
    }));

    try {
      await saveAttendanceBatch(payload);
      message.success("Attendance saved successfully");
      // Re-fetch to show updated statuses
      fetchAttendance({ department_id: selectedDept, target_date: selectedDate.format("YYYY-MM-DD") });
    } catch (err) {
      message.error("Failed to save attendance");
    }
  };

  const columns = [
    { title: "S/L", dataIndex: "sl", key: "sl", width: 70 },
    { title: "Fingerprint/Employee number", dataIndex: "fingerprint_no", key: "fingerprint_no" },
    { title: "Employee name", dataIndex: "employee_name", key: "employee_name" },
    {
      title: "In Time",
      dataIndex: "punch_in_time",
      key: "punch_in_time",
      render: (value, record) => (
        <TimePicker
          value={value ? moment(value, "HH:mm:ss") : null}
          format="HH:mm:ss"
          onChange={(time) => updateRowLocal(record.employee_id, "punch_in_time", time ? time.format("HH:mm:ss") : null)}
          allowClear
        />
      ),
    },
    {
      title: "Out Time",
      dataIndex: "punch_out_time",
      key: "punch_out_time",
      render: (value, record) => (
        <TimePicker
          value={value ? moment(value, "HH:mm:ss") : null}
          format="HH:mm:ss"
          onChange={(time) => updateRowLocal(record.employee_id, "punch_out_time", time ? time.format("HH:mm:ss") : null)}
          allowClear
        />
      ),
    },
  ];

  const dataSource = attendanceRows.map((r, idx) => ({ ...r, key: r.employee_id, sl: idx + 1 }));

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }} align="middle">
        <Col>
          <Select
            placeholder="Select Department"
            style={{ width: 260 }}
            value={selectedDept}
            loading={loadingDepartments}
            onChange={setSelectedDept}
            allowClear
          >
            {departments.map((d) => (
              <Option key={d.id} value={d.id}>
                {d.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <DatePicker value={selectedDate} onChange={(d) => setSelectedDate(d)} />
        </Col>

        <Col>
          <Button type="primary" onClick={handleFilter}>
            Filter
          </Button>
        </Col>

        <Col style={{ marginLeft: "auto" }}>
          <Space>
            <Button icon={<UploadOutlined />} onClick={() => setShowCSVModal(true)}>
              CSV Attendance
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loadingAttendance}
        pagination={{ pageSize: 50 }}
        rowKey="employee_id"
        size="middle"
      />

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>

      <CSVAttendanceModal
        visible={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        onUploaded={() => {
          setShowCSVModal(false);
          // re-fetch if a department + date is selected
          if (selectedDept && selectedDate) fetchAttendance({ department_id: selectedDept, target_date: selectedDate.format("YYYY-MM-DD") });
        }}
      />
    </div>
  );
}