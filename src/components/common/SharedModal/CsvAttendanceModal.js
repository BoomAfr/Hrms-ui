import React, { useState } from "react";
import { Modal, DatePicker, Upload, Button, message, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import moment from "moment";
import { manualAttendanceServices } from "../../../services/manualAttendanceServices";

const { Dragger } = Upload;

export default function CSVAttendanceModal({ visible, onClose, onUploaded }) {
  const [date, setDate] = useState(moment());
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const props = {
    name: "file",
    multiple: false,
    accept: ".csv",
    fileList,
    beforeUpload: (file) => {
      setFileList([file]);
      return false; 
    },
    onRemove: () => setFileList([]),
  };

  const handleUpload = async () => {
    if (!date) return message.error("Please select a date");
    if (!fileList.length) return message.error("Please select a CSV file");

    const file = fileList[0];

    Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  complete: async function (results) {
    try {
      const rows = results.data.map((row) => {
        const punchIn = row["In Time"] ? `${date.format("YYYY-MM-DD")}T${row["In Time"]}` : null;
        const punchOut = row["Out Time"] ? `${date.format("YYYY-MM-DD")}T${row["Out Time"]}` : null;

        return {
          employee_id: Number(row["employee_id"]), 
          punch_in_time: punchIn,
          punch_out_time: punchOut,
          target_date: date.format("YYYY-MM-DD"),
        };
      });

      setUploading(true);
      for (const r of rows) {
        await manualAttendanceServices.patchAttendance(r);
      }

      message.success("CSV uploaded successfully");
      setFileList([]);
      onUploaded && onUploaded();
    } catch (err) {
      if (err.response?.data) {
  const errors = Object.entries(err.response.data)
    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
    .join("\n");
  message.error(`CSV upload failed:\n${errors}`);
} else {
  message.error("CSV upload failed");
} 
    } finally {
      setUploading(false);
    }
  },
});
  };

  return (
    <Modal visible={visible} title="CSV Attendance Upload" onCancel={onClose} footer={null}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <DatePicker value={date} onChange={(d) => setDate(d)} />

        <Dragger {...props} style={{ padding: 12 }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag CSV file to this area to upload</p>
          <p className="ant-upload-hint">CSV must have columns: "Finger ID", Name, "In Time", "Out Time"</p>
        </Dragger>

        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" loading={uploading} onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </Space>
    </Modal>
  );
}