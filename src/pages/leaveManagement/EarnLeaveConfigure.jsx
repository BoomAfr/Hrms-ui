import React from "react";
import { Table, Button, Card, Space, Input } from "antd";
import useEarnLeave from "../../hooks/useEarnLeaveConfigure";
import { useToast } from "../../hooks/useToast";

const EarnLeaveConfigure = () => {
  const { Toast, contextHolder } = useToast();
  const { days, setDays, loading, success, handleUpdate } = useEarnLeave(Toast);

  const columns = [
    {
      title: "S/L",
      dataIndex: "sl",
      key: "sl",
      width: 80,
      align: "center",
    },
    {
      title: "For Month",
      dataIndex: "month",
      key: "month",
      align: "center",
    },
    {
      title: "Day of Earn Leave",
      dataIndex: "days",
      key: "days",
      align: "center",
      render: () => (
        <Input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min={0}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Update",
      key: "update",
      align: "center",
      render: () => (
        <Space>
          <Button
            type="primary"
            onClick={handleUpdate}
            loading={loading}
            className="table-page-add-btn"
          >
            Update
          </Button>
          {success && <span style={{ color: "green" }}>Updated!</span>}
        </Space>
      ),
    },
  ];

  const dataSource = [
    {
      key: 1,
      sl: 1,
      month: 1,
      days: days,
    },
  ];

  return (
    <div className="table-page-container">
      {contextHolder}

      <Card title="Earn Leave Configure" className="table-page-card">
        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            size="middle"
            bordered
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default EarnLeaveConfigure;