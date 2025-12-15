import React, { useEffect, useState } from "react";
import { Card, Row, Col, Select, Button, DatePicker, Table } from "antd";
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
  const [hasFiltered, setHasFiltered] = useState(false);

  useEffect(() => {
    fetchEmployees({ page_size: 1000 });
  }, [fetchEmployees]);

  useEffect(() => {
    if (hasFiltered) {
      fetchSummary({
        page,
        page_size: pageSize,
        employee_id: employeeId,
        from_date: fromMonth ? `${fromMonth.year()}-${String(fromMonth.month() + 1).padStart(2, "0")}-01` : undefined,
        to_date: toMonth ? `${toMonth.year()}-${String(toMonth.month() + 1).padStart(2, "0")}-${toMonth.daysInMonth()}` : undefined,
      });
    }
  }, [fetchSummary, page, pageSize, hasFiltered, employeeId, fromMonth, toMonth]);

  const handleFilter = () => {
    if (!employeeId || !fromMonth || !toMonth) {
      Toast.info("Please select all filters");
      return;
    }
    setPage(1);
    setHasFiltered(true);
  };

  const handleTableChange = (pagination) => {
    if (pagination.current !== page) setPage(pagination.current);
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setPage(1);
    }
  };

  const dataSource = (rows ?? []).map((r, idx) => {
    const monthStr = r.review_month ? moment(r.review_month).format("YYYY-MM") : "";
    let rating = null;

    if (r.overall_rating !== undefined && r.overall_rating !== null) {
      rating = Number(r.overall_rating);
    } else if (Array.isArray(r.ratings_detail) && r.ratings_detail.length) {
      const sum = r.ratings_detail.reduce((acc, it) => acc + Number(it.rating_value || 0), 0);
      rating = sum / r.ratings_detail.length;
    }

    const formattedRating = rating === null || Number.isNaN(rating) ? "N/A" : Number(rating).toFixed(2);

    return {
      key: r.id ?? idx,
      month: monthStr,
      employee_name: r.employee_name,
      rating: formattedRating,
    };
  });

  const columns = [
    {
      title: "S/L",
      key: "sl",
      width: 80,
      align: "center",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    { title: "Employee Name", dataIndex: "employee_name", key: "employee_name" },
    { title: "Month", dataIndex: "month", key: "month" },
    { title: "Rating (Out of 10)", dataIndex: "rating", key: "rating", align: "center" },
  ];

  return (
    <div className="table-page-container">
      {contextHolder}
      <Card className="table-page-card" title="Performance Summary Report">
        <Row className="table-page-filters" gutter={16} style={{ marginBottom: 16 }} align="middle">

          <Col>
            <label style={{ display: "block", marginBottom: 6 }}>Employee</label>
            <Select
              showSearch
              placeholder="Select employee"
              style={{ width: 240 }}
              loading={employeesLoading}
              value={employeeId}
              onChange={setEmployeeId}
              allowClear
              optionFilterProp="children"
              className="table-page-select"
            >
              {employees.map(emp => (
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
              className="table-page-select"
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
              className="table-page-select"
            />
          </Col>

          <Col>
            <label style={{ display: "block", marginBottom: 6 }}>&nbsp;</label>
            <Button type="primary" onClick={handleFilter} className="table-page-add-btn">
              Filter
            </Button>
          </Col>

        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={hasFiltered ? dataSource : []}
            loading={loading}
            pagination={hasFiltered ? {
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              onChange: handleTableChange,
            } : false}
            onChange={handleTableChange}
            bordered
            size="middle"
            locale={{ emptyText: hasFiltered ? (total === 0 ? "No data found" : "No Data") : "Apply filters to view data" }}
          />
        </div>
      </Card>
    </div>
  );
};

export default PerformanceSummary;
