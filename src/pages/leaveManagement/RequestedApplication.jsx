import React, { useEffect, useState } from "react";
import { Table, Card, Tag, Button, Space, Spin } from "antd";
import { getAllLeaveRequests } from "../../services/requestedApplicationsServices";
import ViewModal from "../../components/common/SharedModal/ViewModal";

const RequestedApplication = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [selectedRow, setSelectedRow] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchLeaveRequests = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const res = await getAllLeaveRequests({ page, page_size: pageSize });

      setData(res.results || res || []);
      setPagination({
        current: page,
        pageSize,
        total: res.count || res.length || 0,
      });
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const columns = [
    {
      title: "S/L",
      key: "serial",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 70,
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      align: "center",
    },
    {
      title: "Leave Type",
      dataIndex: "leave_type_name",
      key: "leave_type_name",
      align: "center",
    },
    {
      title: "Request Duration",
      dataIndex: "request_duration",
      key: "request_duration",
      align: "center",
    },
    {
      title: "Request Date",
      dataIndex: "application_date",
      key: "application_date",
      align: "center",
    },
    {
      title: "Number of Days",
      dataIndex: "number_of_days",
      key: "number_of_days",
      align: "center",
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      align: "center",
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
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setSelectedRow(record);
              setIsViewModalOpen(true);
            }}
            className="table-action-btn table-action-btn-edit"
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="table-page-container">
      <Card
        title="Requested Application"
        bordered={false}
        className="table-page-card"
      >
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="table-page-table">
            <Table
              columns={columns}
              dataSource={data}
              rowKey={(record) => record.id || record.pk}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                onChange: (page, pageSize) =>
                  fetchLeaveRequests(page, pageSize),
              }}
              bordered
            />
          </div>
        )}

        <ViewModal
          open={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={selectedRow}
          onSuccess={() =>
            fetchLeaveRequests(pagination.current, pagination.pageSize)
          }
        />
      </Card>
    </div>
  );
};

export default RequestedApplication;