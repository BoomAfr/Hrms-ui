import React, { useState } from "react";
import {
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  Table,
  Space,
  message,
  Spin,
  Typography,
  Divider
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useBonusSettings, useGenerateBonus } from "../../hooks/useBonus";
import { manageEmployeeApi } from "../../services/manageEmployeeServices";

const { Title } = Typography;
const { Option } = Select;

const AddGenerateBonus = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { bonusSettings, loading: settingsLoading } = useBonusSettings();
  const { generate, loading: generating } = useGenerateBonus();

  const [filteredData, setFilteredData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedBonusSetting, setSelectedBonusSetting] = useState(null);
  const handleFilter = async () => {
    const values = form.getFieldsValue();

    if (!values.festival_name || !values.month) {
      message.warning("Please select Festival Name and Month");
      return;
    }

    setTableLoading(true);
    try {

      const response = await manageEmployeeApi.getAll({ page_size: 1000 });
      const allEmployees = response.data.results || [];


      const bonusSetting = bonusSettings.find(bs => bs.id === values.festival_name);
      setSelectedBonusSetting(bonusSetting);


      const activeEmployees = allEmployees.filter(emp =>
        emp.status === 'Active' &&
        emp.pay_grade
      );


      const employeesForPreview = activeEmployees.map((emp) => {
        return {
          key: emp.user_id,
          id: emp.user_id,
          name: emp.name || 'N/A',
          department: emp.department || 'N/A',
          payGrade: emp.pay_grade || 'N/A',
          bonusPercentage: bonusSetting ? `${bonusSetting.percentage_of_basic}%` : 'N/A',
          calculatedOn: bonusSetting ? bonusSetting.calculate_on : 'N/A',
        };
      });

      setFilteredData(employeesForPreview);

      if (employeesForPreview.length === 0) {
        message.info("No active employees with pay grade found");
      } else {
        message.success(`Found ${employeesForPreview.length} eligible employees`);
      }
    } catch (error) {
      message.error("Failed to fetch employees");
      console.error(error);
    } finally {
      setTableLoading(false);
    }
  };


  const handleSave = async () => {
    const values = form.getFieldsValue();

    if (!values.festival_name || !values.month) {
      message.warning("Please select Festival Name and Month");
      return;
    }

    if (filteredData.length === 0) {
      message.warning("No employees to generate bonus for. Please filter first.");
      return;
    }

    try {
      const monthStr = dayjs(values.month).format('YYYY-MM');

      const payload = {
        bonus_setting_id: values.festival_name,
        month: monthStr,
      };

      const result = await generate(payload);

      message.success(
        `Bonus generated successfully! ${result.successful} employees processed.`
      );

      if (result.failed > 0) {
        message.warning(`${result.failed} employees failed. Check console for details.`);
        console.log("Failed employees:", result.errors);
      }


      setTimeout(() => {
        navigate('/payroll/manage-bonus/generate-bonus');
      }, 1500);

    } catch (error) {
      message.error(error.response?.data?.error || "Failed to generate bonus");
      console.error(error);
    }
  };


  const groupByDepartment = (data) => {
    const grouped = {};
    data.forEach(item => {
      const dept = item.department;
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
      grouped[dept].push(item);
    });
    return grouped;
  };


  const columns = [
    {
      title: "S/L",
      key: "sl",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Pay Grade",
      dataIndex: "payGrade",
      key: "payGrade",
    },
    {
      title: "Bonus Percentage",
      dataIndex: "bonusPercentage",
      key: "bonusPercentage",
    },
    {
      title: "Calculated On",
      dataIndex: "calculatedOn",
      key: "calculatedOn",
    },
  ];


  const renderGroupedTables = () => {
    const grouped = groupByDepartment(filteredData);

    return Object.keys(grouped).map(deptName => (
      <div key={deptName} style={{ marginBottom: 24 }}>
        <Title level={5} style={{ marginBottom: 12 }}>
          Department: {deptName}
        </Title>
        <Table
          bordered
          dataSource={grouped[deptName]}
          columns={columns}
          pagination={false}
          size="small"
        />
      </div>
    ));
  };

  return (
    <div className="table-page-container">
      <Card className="table-page-card">
        <Title level={3}>Generate Bonus</Title>
        <Divider />

        <Form
          form={form}
          layout="vertical"
        >
          <Space size="large" style={{ width: '100%', marginBottom: 24 }} wrap>
            <Form.Item
              label="Festival Name"
              name="festival_name"
              rules={[{ required: true, message: 'Please select festival' }]}
              style={{ minWidth: 250 }}
            >
              <Select
                placeholder="Select Festival"
                loading={settingsLoading}
                disabled={settingsLoading}
                showSearch
                optionFilterProp="children"
              >
                {bonusSettings.map(setting => (
                  <Option key={setting.id} value={setting.id}>
                    {setting.festival_name} ({setting.percentage_of_basic}% of {setting.calculate_on})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Month"
              name="month"
              rules={[{ required: true, message: 'Please select month' }]}
              style={{ minWidth: 200 }}
            >
              <DatePicker
                picker="month"
                format="YYYY-MM"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label=" " style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                onClick={handleFilter}
                loading={tableLoading}
                className="table-page-add-btn"
              >
                Filter
              </Button>
            </Form.Item>
          </Space>
        </Form>

        {tableLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" tip="Loading employees..." />
          </div>
        ) : filteredData.length > 0 ? (
          <>
            <Divider />
            {renderGroupedTables()}
          </>
        ) : null}

        <Divider />

        <Space>
          <Button
            type="primary"
            onClick={handleSave}
            loading={generating}
            disabled={filteredData.length === 0}
          >
            Save
          </Button>
          <Button onClick={() => navigate('/payroll/manage-bonus/generate-bonus')}>
            Back
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AddGenerateBonus;
