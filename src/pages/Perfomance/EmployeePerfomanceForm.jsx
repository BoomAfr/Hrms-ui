import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Select, DatePicker, Input, Button, Table, message, Space } from "antd";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEmployeePerformance,
  getEmployeePerformanceDetail,
  updateEmployeePerformance,
  getPerformanceCategories,
  getPerformanceCriteria,
  getEmployees,
} from "../../services/employeePerfomanceServices";

const { Option } = Select;

const EmployeePerformanceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  // form states
  const [employeeId, setEmployeeId] = useState(null);
  const [reviewMonth, setReviewMonth] = useState(null); 
  const [remarks, setRemarks] = useState("");
  const [ratingsState, setRatingsState] = useState([]); 

  // dropdown data
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(false);

  // load dropdowns & existing if edit
  useEffect(() => {
    (async () => {
      try {
        const [empsRes, catsRes, critsRes] = await Promise.all([
          getEmployees(),
          getPerformanceCategories(),
          getPerformanceCriteria(),
        ]);

        const emps = Array.isArray(empsRes) ? empsRes : (empsRes.results || empsRes);
       setEmployees(
          emps.map((e) => ({
            id: e.user_id || e.id, // FIXED
            name: e.full_name || e.name || e.username,
          }))
        );

        setCategories(Array.isArray(catsRes) ? catsRes : (catsRes.results || catsRes));
        setCriteria(Array.isArray(critsRes) ? critsRes : (critsRes.results || critsRes));
      } catch (err) {
        console.error(err);
      }
    })();

    if (id) loadExisting();
    // eslint-disable-next-line
  }, [id]);

  const loadExisting = async () => {
    try {
      setLoading(true);
      const res = await getEmployeePerformanceDetail(id);
      const d = res.data || res;
      setEmployeeId(d.employee || d.employee_id || (d.employee && d.employee.id));
      // backend uses review_month (Date), convert to moment
      setReviewMonth(d.review_month ? moment(d.review_month) : null);
      setRemarks(d.remarks || "");

      // map backend ratings -> local ratingsState: expect rating objects with 'criteria' (id or object) and 'rating_value'
      const mappedRatings = (d.ratings || []).map((r) => {
        const criteriaId = r.criteria && (typeof r.criteria === "object" ? (r.criteria.id || r.criteria.pk || r.criteria) : r.criteria);
        return {
          criteria: criteriaId,
          rating_value: r.rating_value ?? r.rating ?? r.value ?? 0,
        };
      });
      setRatingsState(mappedRatings);
    } catch (err) {
      console.error(err);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Build table data: iterate categories and criteria grouped by category
  const tableData = useMemo(() => {
    // create a flat list but keep category labels empty when repeated like screenshot
    const rows = [];
    categories.forEach((cat) => {
      const critsForCat = criteria.filter((c) => {
        // assume criteria has field category or category id
        if (!c) return false;
        if (c.category && (typeof c.category === "object")) return (c.category.id || c.category.pk) === cat.id;
        return c.category === cat.id;
      });

      if (critsForCat.length === 0) {
        // still show category row with no criteria (optional)
        rows.push({
          key: `cat-${cat.id}`,
          category: cat.category_name,
          criteria: "",
          criteriaId: null,
        });
      } else {
        critsForCat.forEach((crit, idx) => {
          rows.push({
            key: `${cat.id}-${crit.id}`,
            category: idx === 0 ? cat.category_name : "", // show category only on first row for that category
            criteria: crit.criteria_name || crit.name || crit.title || crit.criteria || "",
            criteriaId: crit.id,
          });
        });
      }
    });
    return rows;
  }, [categories, criteria]);

  const getRatingFor = (criteriaId) => {
    const found = ratingsState.find((r) => Number(r.criteria) === Number(criteriaId));
    return found ? found.rating_value : "";
  };

  const onRatingChange = (criteriaId, newVal) => {
    // ensure number and clamp 0-10
    const parsed = newVal === "" ? "" : Number(newVal);
    if (parsed !== "" && (isNaN(parsed) || parsed < 0 || parsed > 10)) {
      // ignore invalid
      return;
    }

    setRatingsState((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((r) => Number(r.criteria) === Number(criteriaId));
      if (idx >= 0) {
        if (parsed === "") copy.splice(idx, 1);
        else copy[idx] = { ...copy[idx], rating_value: parsed };
      } else {
        if (parsed !== "") copy.push({ criteria: criteriaId, rating_value: parsed });
      }
      return copy;
    });
  };

  const submit = async () => {
    if (!employeeId || !reviewMonth) {
      message.error("Please select employee and month");
      return;
    }
    // prepare review_month as a date string (YYYY-MM-01)
    const review_month = reviewMonth.format("YYYY-MM-01");

    const payload = {
      employee: employeeId,
      review_month,
      remarks,
      // backend expects write field name 'ratings_to_add' (per your serializer)
      ratings_to_add: ratingsState.map((r) => ({
        criteria: r.criteria,
        rating_value: r.rating_value,
      })),
    };

    try {
      setLoading(true);
      if (id) {
        await updateEmployeePerformance(id, payload);
        message.success("Performance updated");
      } else {
        await createEmployeePerformance(payload);
        message.success("Performance created");
      }
      navigate("/employee-performance");
    } catch (err) {
      console.error(err);
      message.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Performance Category List",
      dataIndex: "category",
      key: "category",
      width: "35%",
      render: (val) => <div style={{ fontWeight: 500 }}>{val}</div>,
    },
    {
      title: "Performance Criteria List",
      dataIndex: "criteria",
      key: "criteria",
      width: "45%",
    },
    {
      title: "rating (Out of 10)",
      key: "rating",
      width: "20%",
      render: (_, record) => {
        if (!record.criteriaId) return null;
        return (
          <Input
            placeholder="EX: 6"
            value={getRatingFor(record.criteriaId)}
            onChange={(e) => {
              const v = e.target.value;
              // allow empty or numeric
              if (v === "") onRatingChange(record.criteriaId, "");
              else {
                const num = Number(v);
                if (!isNaN(num)) onRatingChange(record.criteriaId, num);
              }
            }}
            style={{ width: "100%" }}
          />
        );
      },
    },
  ];

  return (
    <>
      <h3 style={{ marginBottom: 16 }}>{id ? "Edit" : "Add"} Employee Performance</h3>

      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <label>Employee Name</label>
          <Select
  showSearch
  value={employeeId}
  onChange={(val) => setEmployeeId(val)}
  filterOption={(input, option) =>
    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
  }
  style={{ width: "100%" }}
>
  {employees.map((emp) => (
    <Option key={emp.id} value={emp.id}>
      {emp.name}
    </Option>
  ))}
</Select>
        </Col>

        <Col xs={24} sm={8}>
          <label>Month</label>
          <DatePicker
            picker="month"
            value={reviewMonth}
            onChange={setReviewMonth}
            style={{ width: "100%" }}
          />
        </Col>

        <Col xs={24} sm={8}>
          <label>Remarks</label>
          <Input
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks"
          />
        </Col>
      </Row>

      <div style={{ marginTop: 20 }}>
        <h4>CRITERIA LIST</h4>
        <Table
          bordered
          columns={columns}
          dataSource={tableData}
          pagination={false}
          rowKey="key"
          size="middle"
        />
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
        <Space>
          <Button onClick={() => navigate("/employee-performance")}>Cancel</Button>
          <Button type="primary" loading={loading} onClick={submit}>
            {id ? "Update" : "Save"}
          </Button>
        </Space>
      </div>
    </>
  );
};

export default EmployeePerformanceForm;
