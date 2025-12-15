import React, { useState } from "react";
import { Card, Row, Col, Select, Input, Table, Button, Space } from "antd";
import { useEmployeePermanent } from "../hooks/useEmployeePermanent";
import { useToast } from "../hooks/useToast";

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
    } catch {}
  };

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  const columns = [
    {
      title: "Serial",
      width: 80,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "Photo",
      dataIndex: "photo",
      width: 90,
      render: (val, record) =>
        val ? (
          <img
            src={val}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: 6 }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: "#e6f7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(record.name || "U").charAt(0)}
          </div>
        ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Department", dataIndex: "department" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Fingerprint/Emp No.", dataIndex: "employee_id" },
    { title: "Pay Grade Name", dataIndex: "pay_grade" },
    { title: "Date of Joining", dataIndex: "date_of_joining" },
    {
      title: "Status",
      dataIndex: "job_status",
      render: (val, record) => (
        <Select
          value={statusMap[record.user_id] ?? val}
          onChange={(v) => onStatusChange(record.user_id, v)}
          style={{ minWidth: 160 }}
          loading={filtersLoading}
          options={STATUS_OPTIONS}
          placeholder="Select status"
          className="table-page-select"
        />
      ),
    },
    {
      title: "Action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleUpdateStatus(record)}
            className="table-action-btn table-action-btn-edit"
          >
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
    name:
      e.name ??
      e.full_name ??
      `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim(),
    department: e.department?.name ?? e.department_name ?? "--",
    phone: e.phone ?? e.mobile ?? "--",
    employee_id: e.employee_id ?? e.emp_no ?? "--",
    pay_grade: e.pay_grade?.name ?? e.pay_grade_name ?? "--",
    date_of_joining: e.date_of_joining ?? "--",
    job_status: e.job_status ?? "--",
  }));

  return (
    <div className="table-page-container">
      {contextHolder}

      <Card className="table-page-card" title="Employee Permanent">
        <Row className="table-page-filters" gutter={16} align="middle">
          <Col flex="320px">
            <Input.Search
              placeholder="Search by employee name..."
              onSearch={(val) => setSearch(val)}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ width: "100%" }}
              className="table-page-search"
            />
          </Col>

          <Col>
            <Select
              placeholder="Select Department"
              style={{ minWidth: 220 }}
              value={filters.department_id || undefined}
              onChange={(v) =>
                setFilters((p) => ({ ...p, department_id: v }))
              }
              allowClear
              className="table-page-select"
              options={(departments || []).map((d) => ({
                label: d.name,
                value: d.id,
              }))}
            />
          </Col>

          <Col>
            <Select
              placeholder="Select Designation"
              style={{ minWidth: 220 }}
              value={filters.designation_id || undefined}
              onChange={(v) =>
                setFilters((p) => ({ ...p, designation_id: v }))
              }
              allowClear
              className="table-page-select"
              options={(designations || []).map((d) => ({
                label: d.name,
                value: d.id,
              }))}
            />
          </Col>

          <Col>
            <Select
              placeholder="Select Role"
              style={{ minWidth: 220 }}
              value={filters.role || undefined}
              onChange={(v) => setFilters((p) => ({ ...p, role: v }))}
              allowClear
              className="table-page-select"
              options={(roles || []).map((r) => ({
                label: r.name,
                value: r.id ?? r.name,
              }))}
            />
          </Col>
        </Row>

        <div className="table-page-table">
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
            rowKey="key"
            size="middle"
            bordered
            scroll={{ x: 1200 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default EmployeePermanent;
