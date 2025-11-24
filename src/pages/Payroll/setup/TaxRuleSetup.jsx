import React from "react";
import { Table, Card, Button, InputNumber, Space,  } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {useTaxRules} from "../../../hooks/payroll/useTaxRuleSetup"

const TaxRuleSetup = () => {
  const {
    maleRules,
    femaleRules,
    setMaleRules,
    setFemaleRules,
    loading,
    updateRules,
  } = useTaxRules();

  const addNewRow = (gender) => {
    const newRow = {
      id: null,
      gender,
      slab_type: "Next",
      total_income_limit: 0,
      tax_rate_percentage: 0,
      taxable_amount_fixed: 0,
      is_active: true,
    };

    if (gender === "Male") {
      setMaleRules([...maleRules, newRow]);
    } else {
      setFemaleRules([...femaleRules, newRow]);
    }
  };

  const updateField = (gender, index, field, value) => {
    if (gender === "Male") {
      const newList = [...maleRules];
      newList[index][field] = value;
      setMaleRules(newList);
    } else {
      const newList = [...femaleRules];
      newList[index][field] = value;
      setFemaleRules(newList);
    }
  };

  const columns = (gender) => [
    {
      title: "S/L",
      render: (_, __, index) => index + 1,
      width: 80,
      align: "center",
    },
    {
      title: "Total Income",
      dataIndex: "total_income_limit",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          value={record.total_income_limit}
          onChange={(v) =>
            updateField(gender, index, "total_income_limit", v)
          }
        />
      ),
    },
    {
      title: "Tax Rate %",
      dataIndex: "tax_rate_percentage",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          max={100}
          style={{ width: "100%" }}
          value={record.tax_rate_percentage}
          onChange={(v) =>
            updateField(gender, index, "tax_rate_percentage", v)
          }
        />
      ),
    },
    {
      title: "Taxable Amount",
      dataIndex: "taxable_amount_fixed",
      align: "center",
      render: (_, record) => (
        <span>{record.taxable_amount_fixed}</span>
      ),
    },
    {
      title: "Update",
      align: "center",
      render: () => (
        <Button type="primary" onClick={updateRules}>
          Update
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Tax Rules (Male)"
        extra={
          <Button type="primary" onClick={() => addNewRow("Male")}icon={<PlusOutlined/>}>
            Add Tax Rule for Male
          </Button>
        }
        style={{ marginBottom: 32 }}
      >
        <Table
          bordered
          loading={loading}
          rowKey={(record, index) => index}
          columns={columns("Male")}
          dataSource={maleRules}
          pagination={false}
        />
      </Card>

      <Card
        title="Tax Rules (Female)"
        extra={
          <Button type="primary" onClick={() => addNewRow("Female")}icon={<PlusOutlined/>}>
            Add Tax Rule for Female
          </Button>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={(record, index) => index}
          columns={columns("Female")}
          dataSource={femaleRules}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default TaxRuleSetup;

