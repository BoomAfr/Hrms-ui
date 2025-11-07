import React from 'react';
import { Modal } from 'antd';

const ConfirmModal = ({ isOpen, title, message, onOk, onCancel }) => {
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
      destroyOnClose
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
