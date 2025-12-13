import React, { useEffect, useState } from "react";
import { Descriptions, Table, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeePerformanceDetail } from "../../services/employeePerfomanceServices";

const ViewEmployeePerformance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmployeePerformanceDetail(id);
        const d = res.data || res;

        
        const mappedRatings = (d.ratings || []).map((r) => ({
          key: r.criteria,
          category: "", // backend does not provide category
          criteria: r.criteria_name || r.criteria, 
          rating: r.rating_value ?? r.rating ?? r.value ?? "",
        }));

        setData({ ...d, mappedRatings });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!data) return null;

  const columns = [
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Criteria", dataIndex: "criteria", key: "criteria" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
  ];

  return (
    <>
      <Button style={{ marginBottom: 12 }} onClick={() => navigate(-1)}>Back</Button>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Employee">{data.employee_name || (data.employee && data.employee.full_name)}</Descriptions.Item>
        <Descriptions.Item label="Month">{data.review_month}</Descriptions.Item>
        <Descriptions.Item label="Remarks">{data.remarks}</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={data.mappedRatings}
          pagination={false}
          rowKey="key"
        />
      </div>
    </>
  );
};

export default ViewEmployeePerformance;
