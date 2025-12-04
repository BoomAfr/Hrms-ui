import React, { useState } from "react";
import { Card, Row, Col, Select, Input, Table, Button, Space } from "antd";
import { useEmployeePermanent } from "../hooks/useEmployeePermanent";
import { useToast } from "../hooks/useToast";
import { EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const STATUS_OPTIONS = [
  { label: "Probation Period", value: "Probation" },
  { label: "Permanent", value: "Permanent" },
  { label: "Full Time", value: "Full-time" },
  { label: "Part Time", value: "Part-timee" },
];

const EmployeePermanent = () => {
  const {
    employees,
    departments,
    designations,
    roles,
    loading,
    filtersLoading,
    filters,
    setFilters,
    setSearch,
    pagination,
    setPagination,
    updateJobStatus,
  } = useEmployeePermanent();

  const { Toast, contextHolder } = useToast();

  const [statusMap, setStatusMap] = useState({});

  const onStatusChange = (userId, value) => {
    setStatusMap((prev) => ({ ...prev, [userId]: value }));
  };

  const handleUpdateStatus = async (record) => {
    const userId = record?.user_id ?? record?.id ?? record?.key;
    const newStatus = statusMap[userId];
    if (!newStatus) {
      Toast.error("Please select a status first");
      return;
    }
    try {
      await updateJobStatus(userId, newStatus, Toast);
    } catch (err) {

    }
  };

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  const columns = [
    { title: "Serial", dataIndex: "serial", key: "serial", width: 80, render: (_, __, idx) => idx + 1 },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      width: 90,
      render: (val, record) =>
        val ? <img src={val} alt="avatar" style={{ width: 40, height: 40, borderRadius: 6 }} /> : <div style={{ width: 40, height: 40, borderRadius: 6, background: "#e6f7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>{(record.name || "U").charAt(0)}</div>
    },
    { title: "Name", dataIndex: "name", key: "name", render: (text) => text ?? "--" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Fingerprint/Emp No.", dataIndex: "employee_id", key: "employee_id" },
    { title: "Pay Grade Name", dataIndex: "pay_grade", key: "pay_grade" },
    { title: "Date of Joining", dataIndex: "date_of_joining", key: "date_of_joining" },
    {
      title: "Status",
      dataIndex: "job_status",
      key: "job_status",
      render: (val, record) => (
        <Select
          value={statusMap[record.user_id] ?? val}
          onChange={(v) => onStatusChange(record.user_id, v)}
          style={{ minWidth: 160 }}
          loading={filtersLoading}
          options={STATUS_OPTIONS}
          placeholder="Select status"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleUpdateStatus(record)}>
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = (employees || []).map((e) => ({
    key: e.id ?? e.user_id,
    user_id: e.user_id ?? e.id,
    photo: e.photo_url ?? e.avatar ?? null,
    name: e.name ?? e.full_name ?? `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim(),
    department: e.department?.name ?? e.department ?? e.department_name ?? "--",
    phone: e.phone ?? e.mobile ?? e.contact_no ?? "--",
    employee_id: e.employee_id ?? e.fingerprint_id ?? e.emp_no ?? "--",
    pay_grade: e.pay_grade?.name ?? e.pay_grade ?? e.pay_grade_name ?? "--",
    date_of_joining: e.date_of_joining ?? e.joining_date ?? "--",
    job_status: e.job_status ?? e.status ?? "--",
  }));

  return (
    <Card title="Employee Permanent">
      {contextHolder}

      <Row gutter={16} style={{ marginBottom: 16, alignItems: "center" }}>
        <Col flex="320px">
          <Input.Search
            placeholder="Search by employee name..."
            onSearch={(val) => setSearch(val)}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: "100%" }}
          />
        </Col>

        <Col>
          <Select
            placeholder="Select Department"
            style={{ minWidth: 220 }}
            value={filters.department_id || undefined}
            onChange={(value) => setFilters((p) => ({ ...p, department_id: value }))}
            allowClear
            options={(departments || []).map((d) => ({ label: d.name || d.title || d.department, value: d.id ?? d.user_id ?? d.key }))}
          />
        </Col>

        <Col>
          <Select
            placeholder="Select Designation"
            style={{ minWidth: 220 }}
            value={filters.designation_id || undefined}
            onChange={(value) => setFilters((p) => ({ ...p, designation_id: value }))}
            allowClear
            options={(designations || []).map((d) => ({ label: d.name || d.title, value: d.id }))}
          />
        </Col>

        <Col>
          <Select
            placeholder="Select Role"
            style={{ minWidth: 220 }}
            value={filters.role || undefined}
            onChange={(value) => setFilters((p) => ({ ...p, role: value }))}
            allowClear
            options={(roles || []).map((r) => ({ label: r.name || r.title, value: r.id ?? r.name }))}
          />
        </Col>
      </Row>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          onChange: handlePageChange,
        }}
        rowKey={(r) => r.key}
        size="middle"
        bordered
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default EmployeePermanent;
