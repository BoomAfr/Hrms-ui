import React, { useState } from "react";
import { Modal, DatePicker, Upload, Button, message, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";
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
      return false; // prevent auto upload
    },
    onRemove: () => setFileList([]),
  };

  const handleUpload = async () => {
    if (!date) return message.error("Please select a date");
    if (!fileList.length) return message.error("Please select a CSV file");

    const fd = new FormData();
    fd.append("file", fileList[0]);
    fd.append("target_date", date.format("YYYY-MM-DD"));

    try {
      setUploading(true);
      await manualAttendanceServices.uploadCSV(fd);
      message.success("CSV uploaded successfully");
      setFileList([]);
      onUploaded && onUploaded();
    } catch (err) {
      console.error(err);
      message.error("CSV upload failed");
    } finally {
      setUploading(false);
    }
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
          <p className="ant-upload-hint">CSV must have columns: "Finger ID",Name,"In Time","Out Time"</p>
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