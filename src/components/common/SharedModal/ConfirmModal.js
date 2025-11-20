import React from 'react';
import { Modal } from 'antd';
import { useManageEmployee } from '../../../hooks/useManageEmployee';

const ConfirmModal = ({ isOpen, title, message, onOk, onCancel }) => {
  const {loading} = useManageEmployee();
  return (
    <Modal
      title={title || 'Confirm Delete'}
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      okText="Delete"
      okType="danger"
      cancelText="Cancel"
      centered
confirmLoading={loading
  
}    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
