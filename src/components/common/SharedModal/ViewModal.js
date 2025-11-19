import React, { useState, useEffect } from "react";
import { Modal, Descriptions, Button, Input, Space, message } from "antd";
import { approveRejectLeave } from "../../../services/requestedApplicationsServices";
import {useToast} from "../../../hooks/useToast"

const ViewModal = ({ open, onClose, data, onSuccess }) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const {Toast,contextHolder} = useToast();

  useEffect(() => {
  if (open) {
    setRejectMode(false);
    setReason("");
  }
}, [open, data]);

  if (!data) return null;



  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveRejectLeave(data.id, "Approved");
      Toast.success("Leave Approved Successfully")
      //message.success("Leave Approved Successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      Toast.error(err.response?.data?.error || "Approval failed")
     // message.error(err.response?.data?.error || "Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      Toast.warning("Rejection reason is required")
      //message.warning("Rejection reason is required");
      return;
    }

    try {
      setLoading(true);
      await approveRejectLeave(data.id, "Rejected", reason);
      Toast.success("Leave Rejected Successfully")
      //message.success("Leave Rejected Successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      Toast.error(err.response?.data?.error || "Rejection failed")
      //message.error(err.response?.data?.error || "Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Leave Application Details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
    >
      {contextHolder}
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Employee Name">
          {data.employee_name}
        </Descriptions.Item>

        <Descriptions.Item label="Leave Type">
          {data.leave_type_name}
        </Descriptions.Item>

        <Descriptions.Item label="Duration">
          {data.request_duration}
        </Descriptions.Item>

        <Descriptions.Item label="Request Date">
          {data.application_date}
        </Descriptions.Item>

        <Descriptions.Item label="Number of Days">
          {data.number_of_days}
        </Descriptions.Item>

        <Descriptions.Item label="Purpose">{data.purpose}</Descriptions.Item>

        <Descriptions.Item label="Status">{data.status}</Descriptions.Item>

        {data.status === "Rejected" && (
          <Descriptions.Item label="Rejection Reason">
            {data.rejection_reason}
          </Descriptions.Item>
        )}
      </Descriptions>


      <div style={{ marginTop: 20, textAlign: "right" }}>
        <Space>
          {data.status === "Pending" && (
            <Button
              type="primary"
              loading={loading}
              onClick={handleApprove}
            >
              Approve
            </Button>
          )}

          {data.status === "Pending" && !rejectMode && (
            <Button danger onClick={() => setRejectMode(true)}>
              Reject
            </Button>
          )}
        </Space>
      </div>

      {rejectMode && data.status === "Pending" && (
        <div style={{ marginTop: 20 }}>
          <label>Rejection Reason:</label>
          <Input.TextArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Write the reason for rejection..."
          />
          <Button
            danger
            block
            style={{ marginTop: 10 }}
            loading={loading}
            onClick={handleReject}
          >
            Submit Rejection
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ViewModal;