import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  DatePicker,
  Table,
} from "antd";
import moment from "moment";
import { usePerformanceSummary } from "../../hooks/usePerfomanceSummaryReport";
import { useToast } from "../../hooks/useToast";

const { Option } = Select;
const { MonthPicker } = DatePicker;

const PerformanceSummary = () => {
  const { Toast, contextHolder } = useToast();

  const {
    rows,
    employees,
    loading,
    employeesLoading,
    total,
    fetchSummary,
    fetchEmployees,
  } = usePerformanceSummary();

  const [employeeId, setEmployeeId] = useState(null);
  const [fromMonth, setFromMonth] = useState(null);
  const [toMonth, setToMonth] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  useEffect(() => {
    fetchEmployees({ page_size: 1000 });
  }, [fetchEmployees]);

  useEffect(() => {
    fetchSummary({
      page,
      page_size: pageSize,
    });
  }, [fetchSummary, page, pageSize]);


  const handleFilter = async () => {
    try {
      const params = {
        page,
        page_size: pageSize,
      };

      if (employeeId) params.employee_id = employeeId;
      if (fromMonth)
        params.from_date = moment(fromMonth).startOf("month").format("YYYY-MM-DD");
      if (toMonth)
        params.to_date = moment(toMonth).endOf("month").format("YYYY-MM-DD");

      await fetchSummary(params);
    } catch (err) {
      Toast.error("Failed to fetch summary");
    }
  };

  const handleTableChange = (pagination) => {
    if (pagination.current !== page) setPage(pagination.current);
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setPage(1);
    }
  };

  const dataSource = (rows ?? []).map((r, idx) => {
    const monthStr = r.review_month
      ? moment(r.review_month).format("YYYY-MM")
      : "";

    let rating = null;
    if (r.overall_rating !== undefined && r.overall_rating !== null) {
      rating = Number(r.overall_rating);
    } else if (Array.isArray(r.ratings) && r.ratings.length) {
      const sum = r.ratings.reduce(
        (acc, it) => acc + Number(it.rating_value || 0),
        0
      );
      rating = sum / r.ratings.length;
    }

    const formattedRating =
      rating === null || Number.isNaN(rating)
        ? "N/A"
        : Number(rating).toFixed(2);

    return {
      key: r.id ?? idx,
      month: monthStr,
      rating: formattedRating,
    };
  });

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Rating (Out of 10)",
      dataIndex: "rating",
      key: "rating",
      align: "center",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Card title="Performance Summary Report">
        <Row gutter={16} style={{ marginBottom: 16 }} align="middle">
          
          <Col>
            <label style={{ display: "block", marginBottom: 6 }}>Employee</label>
            <Select
              showSearch
              placeholder="Select employee"
              style={{ width: 240 }}
              loading={employeesLoading}
              value={employeeId}
              onChange={(val) => setEmployeeId(val)}
              allowClear
              optionFilterProp="children"
            >
              {employees.map((emp) => (
                <Option key={emp.user_id} value={emp.user_id}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col>
            <label style={{ display: "block", marginBottom: 6 }}>From Month</label>
            <MonthPicker
              style={{ width: 180 }}
              placeholder="Select from month"
              value={fromMonth}
              onChange={setFromMonth}
              allowClear
            />
          </Col>

          <Col>
            <label style={{ display: "block", marginBottom: 6 }}>To Month</label>
            <MonthPicker
              style={{ width: 180 }}
              placeholder="Select to month"
              value={toMonth}
              onChange={setToMonth}
              allowClear
            />
          </Col>

          <Col>
            <label style={{ display: "block", marginBottom: 6 }}>&nbsp;</label>
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Col>

        </Row>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default PerformanceSummary;
