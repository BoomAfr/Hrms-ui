
import React, { useState, useEffect } from "react";
import { Card, Button, Input, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ApplyForLeaveModal from "../../components/common/SharedModal/ApplyForLeaveModal";
import { useApplyLeave } from "../../hooks/useApplyForLeave";

const ApplyForLeavePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const { applications, pagination, fetchMyApplications, loading } = useApplyLeave();

  useEffect(() => {
    loadData(currentPage, pageSize, searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const loadData = async (page = 1, pageSizeArg = 10, search = "") => {
    try {
      await fetchMyApplications(page, pageSizeArg, search);
    } catch (err) {
      message.error("Failed to load applications");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
    loadData(1, pageSize, value);
  };

  const columns = [
    { title: "#", dataIndex: "sl", key: "sl", width: 60, render: (_, __, idx) => idx + 1 },
    { title: "Employee Name", dataIndex: "employee_name", key: "employee_name" },
    { title: "Leave Type", dataIndex: "leave_type_name", key: "leave_type_name" },
    {
      title: "Request Duration",
      dataIndex: "duration",
      key: "duration",
      render: (_, record) =>
        record.from_date && record.to_date ? `${record.from_date} to ${record.to_date}` : "-",
    },
    { title: "Number of Days", dataIndex: "number_of_days", key: "number_of_days" },
    {
      title: "Approve Status",
      dataIndex: "approve_status",
      key: "approve_status",
      render: (val) => val ?? "-",
    },
    {
      title: "Reject Status",
      dataIndex: "reject_status",
      key: "reject_status",
      render: (val) => val ?? "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => s ?? "-",
      width: 120,
    },
  ];

  const dataSource = (applications || []).map((a, i) => ({
    key: a.id ?? i,
    sl: i + 1,
    employee_name: a.employee_name || a.employee?.name || "You",
    leave_type_name: a.leave_type_name ?? a.leave_type?.name ?? a.leave_type ?? "",
    from_date: a.from_date ?? a.start_date ?? null,
    to_date: a.to_date ?? a.end_date ?? null,
    number_of_days: a.number_of_days ?? a.days ?? 0,
    approve_status: a.approved_by ?? a.approve_status ?? a.approve ?? "",
    reject_status: a.rejected_by ?? a.reject_status ?? a.rejected ?? "",
    status: a.status ?? a.application_status ?? "",
  }));

  const paginationConfig = {
    current: pagination.current || currentPage,
    pageSize: pagination.pageSize || pageSize,
    total: pagination.count || 0,
    showSizeChanger: true,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
      loadData(page, size, searchText);
    },
    pageSizeOptions: ["10", "20", "50", "100"],
    showQuickJumper: true,
    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="My Application List"
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Search by leave type..."
              onSearch={handleSearch}
              style={{ width: 260 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenModal(true)}
            >
              Apply For Leave
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={paginationConfig}
          loading={loading}
          rowKey={(r) => r.key}
          size="middle"
          bordered
          scroll={{ x: 1000 }}
        />
      </Card>

      {openModal && (
        <ApplyForLeaveModal
          isModalOpen={openModal}
          setIsModalOpen={setOpenModal}
          onSuccess={() => loadData(1, pageSize, searchText)}
        />
      )}
    </div>
  );
};

export default ApplyForLeavePage;
