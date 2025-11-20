import { useState, useEffect } from "react";
import { jobPostAPI } from "../services/jobPostServices";
import { message } from "antd";

export const useJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");

  const fetchJobPosts = async (page = 1, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize, search };
      const res = await jobPostAPI.getAll(params);
      const results = res.data?.results //|| res.data || [];
      const total = res.data?.count ?? results.length;
      setJobPosts(results);
      setPagination({ current: page, pageSize, total });
    } catch (error) {
      message.error("Failed to load job posts");
    } finally {
      setLoading(false);
    }
  };

  const updateJobPost = async (id, data) => {
  try {
    await jobPostAPI.update(id, data);
    message.success("Job post updated successfully");
    fetchJobPosts(pagination.current, pagination.pageSize, search);
  } catch (error) {
    message.error("Failed to update job post");
  }
};

  const createJobPost = async (data) => {
    try {
      await jobPostAPI.create(data);
      message.success("Job post created successfully");
      fetchJobPosts();
    } catch (error) {
      message.error("Failed to create job post");
    }
  };

  const deleteJobPost = async (id) => {
    try {
      await jobPostAPI.delete(id);
      message.success("Job post deleted");
      fetchJobPosts(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Failed to delete job post");
    }
  };

  useEffect(() => {
    fetchJobPosts(pagination.current, pagination.pageSize, search);
  }, []);

  return {
    jobPosts,
    loading,
    pagination,
    setPagination,
    fetchJobPosts,
    createJobPost,
    updateJobPost,
    deleteJobPost,
    search,
    setSearch,
  };
};