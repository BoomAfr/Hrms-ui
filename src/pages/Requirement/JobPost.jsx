import React, { useState } from "react";
import {
  Card, Table, Button, Space, Input, Tag, Modal, Descriptions, Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import JobPostModal from "../../components/common/SharedModal/JobPostModal";
import { useJobPosts } from "../../hooks/useJobPost";
import { jobPostAPI } from "../../services/jobPostServices";

const { Search } = Input;

const JobPost = () => {
  const {
    jobPosts, loading, pagination, fetchJobPosts, createJobPost, deleteJobPost, updateJobPost, search, setSearch, } = useJobPosts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSearch = (value) => {
    setSearch(value);
    fetchJobPosts(1, pagination.pageSize, value);
  };
  const handleView = async (id) => {
    const res = await jobPostAPI.getById(id);
    setSelected(res.data);
    setViewModal(true);
  };

  const handleEdit = async (id) => {
    const res = await jobPostAPI.getById(id);
    setEditData(res.data);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "S/L",
      dataIndex: "id",
      width: 70,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Job Title",
      dataIndex: "job_title",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 700 }}>{record.job_title}</div>
          <div style={{ fontSize: 13, color: "gray" }}>{record.job_post}</div>
        </div>
      ),
    },
    {
      title: "Published By",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 700 }}>{record.published_by || "—"}</div>
          <div style={{ fontSize: 13, color: "gray" }}>
            Publish Date:{" "}
            {record.job_publish_date
              ? dayjs(record.job_publish_date).format("YYYY-MM-DD")
              : "—"}
          </div>
        </div>
      ),
    },
    {
      title: "Application End Date",
      dataIndex: "application_end_date",
      align: "center",
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD") : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "PUBLISHED" ? "green" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleView(record.id)} className="table-action-btn table-action-btn-view">
            View
          </Button>
          <Button size="small" onClick={() => handleEdit(record.id)} className="table-action-btn table-action-btn-edit">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteJobPost(record.id)}
          >
            <Button size="small" danger className="table-action-btn table-action-btn-delete">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="table-page-container">
      <Card
        className="table-page-card"
        title="Job Posts"
        extra={
          <Space>
            <Search
              placeholder="Search job..."
              allowClear
              onSearch={handleSearch}
              className="table-page-search"
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditData(null);
                setIsModalOpen(true);
              }}
              className="table-page-add-btn"
            >
              Create Job Post
            </Button>
          </Space>
        }
      >
        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={jobPosts}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) => fetchJobPosts(page, pageSize, search),
            }}
            bordered
          />
        </div>
      </Card>

      <JobPostModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) =>
          editData
            ? updateJobPost(editData.id, data)
            : createJobPost(data)
        }
        initialData={editData}
      />

      <Modal
        open={viewModal}
        title="Job Post Details"
        onCancel={() => setViewModal(false)}
        footer={null}
        width={700}
      >
        {selected && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Job Title">
              {selected.job_title}
            </Descriptions.Item>
            <Descriptions.Item label="Job Post">
              {selected.job_post}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selected.description}
            </Descriptions.Item>
            <Descriptions.Item label="Published By">
              {selected.published_by}
            </Descriptions.Item>
            <Descriptions.Item label="Publish Date">
              {selected.job_publish_date
                ? dayjs(selected.job_publish_date).format("YYYY-MM-DD")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Application End Date">
              {selected.application_end_date
                ? dayjs(selected.application_end_date).format("YYYY-MM-DD")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={selected.status === "PUBLISHED" ? "green" : "default"}
              >
                {selected.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default JobPost;