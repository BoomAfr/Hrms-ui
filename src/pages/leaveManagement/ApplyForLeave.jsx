import React, { useState, useEffect } from "react";
import { Card, Button, Input, Table, message, Tag, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import ApplyForLeaveModal from "../../components/common/SharedModal/ApplyForLeaveModal";
import { useApplyLeave } from "../../hooks/useApplyForLeave";

const ApplyForLeavePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const { user: savedUser } = useSelector((state) => state.auth);
  const { applications, pagination, fetchMyApplications, loading } = useApplyLeave();

  useEffect(() => {
    loadData(currentPage, pageSize, searchText);
  }, [currentPage, pageSize]);

  const loadData = async (page = 1, pageSizeArg = 10, search = "") => {
    try {
      await fetchMyApplications(page, pageSizeArg, search);
    } catch {
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
      title: "Approve Date",
      dataIndex: "approve_date",
      key: "approve_date",
      render: (val) => val ?? "-",
    },
    {
      title: "Reject Date",
      dataIndex: "reject_date",
      key: "reject_date",
      render: (val) => val ?? "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "blue";
        if (status === "Approved") color = "green";
        else if (status === "Rejected") color = "red";
        else if (status === "Pending") color = "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const dataSource = (applications || []).map((a, i) => ({
    key: a.id ?? i,
    sl: i + 1,
    employee_name: savedUser?.name || "You",
    leave_type_name: a.leave_type_name ?? a.leave_type?.name ?? a.leave_type ?? "",
    from_date: a.from_date ?? a.start_date ?? null,
    to_date: a.to_date ?? a.end_date ?? null,
    number_of_days: a.number_of_days ?? a.days ?? 0,
    approve_date: a.approved_date ?? null,
    reject_date: a.reject_date ?? null,
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
    <div className="table-page-container">
      <Card title="My Application List" className="table-page-card">
        <Row className="table-page-filters" align="middle" justify="space-between">
          <Col>
            <Input.Search
              placeholder="Search by leave type..."
              onSearch={handleSearch}
              allowClear
              className="table-page-search"
              style={{ width: 260 }}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenModal(true)}
              className="table-page-add-btn"
            >
              Apply For Leave
            </Button>
          </Col>
        </Row>

        <div className="table-page-table">
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
        </div>
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