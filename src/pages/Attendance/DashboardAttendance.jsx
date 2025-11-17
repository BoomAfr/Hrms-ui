import React from "react";
import { Card, Select, Button, Input, Divider, Typography,  } from "antd";
import { useDashboardAttendance } from "../../hooks/useDashboardAttendance";

const { Title, Text } = Typography;

const DashboardAttendanceSetting = () => {
  const {
    form,
    setForm,
    loading,
    addIP,
    removeIP,
    updateIP,
    updateSettings,
  } = useDashboardAttendance();

  return (
    <Card
      title={<Title level={4} style={{ margin: 0 }}>Dashboard Attendance Setting by IP</Title>}
      style={{
        padding: "20px",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        background: "#ffffff",
      }}
    >
      
      <div style={{ marginBottom: 25, display: "flex", flexDirection: "column" }}>
  <label style={{ fontWeight: 600, marginBottom: 6 }}>
    Employee Self Attendance Status
  </label>

  <Select
    style={{ width: 320 }}
    value={form.attendance_status}
    onChange={(value) => setForm({ ...form, attendance_status: value })}
    size="large"
    options={[
      { label: "Yes - User Can Give Attendance", value: "yes" },
      { label: "No - User Can't Give Attendance", value: "no" },
    ]}
  />
</div>

      <Divider />

      
      <div style={{ marginBottom: 25, display: "flex", flexDirection: "column" }}>
  <label style={{ fontWeight: 600, marginBottom: 6 }}>
    Should Check Whitelisted IP Address?
  </label>

  <Select
    style={{ width: 380 }}
    value={form.ip_check}
    onChange={(value) => setForm({ ...form, ip_check: value })}
    size="large"
    options={[
      { label: "User Can Give Attendance With Any IP", value: "any" },
      {
        label: "User Can Give Attendance Only By Whitelisted IP",
        value: "whitelist_only",
      },
    ]}
  />
</div>

      <Divider />

      {/* IP List */}
      <div style={{ marginBottom: 30 }}>
        <Text strong>Please Enter Whitelisted IP Addresses</Text>

        {form.whitelisted_ips.map((ip, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 12,
            }}
          >
            <Input
              style={{ width: 320 }}
              size="large"
              value={ip}
              onChange={(e) => updateIP(index, e.target.value)}
              placeholder="Enter IP Address (e.g., 192.168.1.10)"
            />

            <Button
              danger
              type="primary"
              shape="circle"
              onClick={() => removeIP(index)}
            >
              X
            </Button>
          </div>
        ))}

        <Button
          style={{ marginTop: 16 }}
          type="dashed"
          onClick={addIP}
          size="large"
        >
          + Add More IP
        </Button>
      </div>

      <Divider />

      {/* Update Button */}
      <Button
        type="primary"
        loading={loading}
        size="large"
        style={{
          marginTop: 15,
          paddingInline: 40,
          fontWeight: 600,
        }}
        onClick={updateSettings}
      >
        Update Setting
      </Button>
    </Card>
  );
};

export default DashboardAttendanceSetting;
