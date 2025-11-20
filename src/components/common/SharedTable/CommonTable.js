import React from 'react';
import { Table, Input, Select, Space, Button, Card, Pagination } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import ConfirmModal from '../SharedModal/ConfirmModal';
import CommonFormModal from '../SharedModal/SharedModal';

const { Search } = Input;
const { Option } = Select;

const CommonTable = ({
  title = "Table",
  data = [],
  columns = [],
  loading = false,
  showSearch = true,
  showEntriesFilter = true,
  showPagination = true,
  onSearch,
  onRefresh,
  onPageChange,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  searchPlaceholder = "Search...",
  extraButtons = null,
  deleteModal,
  formModal,
}) => {
  console.log(deleteModal,'deleteModal')
  const getDeleteModalProps = (flag) => {
    if (deleteModal) {
      switch (flag) {
        case "isOpen": return (deleteModal.isOpen);
        case "message": return (deleteModal.message);
        case "onOk": return (deleteModal.onOk);
        case "onCancel": return (deleteModal.onCancel);
        default: return null;
      }
    }
  }
  const getformModalProps = (flag) => {
    if (formModal) {
      switch (flag) {
        case "isOpen": return (formModal.isModalOpen);
        case "title": return (formModal.title);
        case "message": return (formModal.message);
        case "handleDeleteConfirm": return (formModal.onSubmit);
        case "setIsModalOpen": return (formModal.setIsModalOpen);
        case "fieldLabel": return (formModal.fieldLabel);
        case "onSubmit": return (formModal.onSubmit);
        default: return null;
      }
  }
}

  // Default pagination settings
  const paginationConfig = showPagination ? {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `Showing ${range[0]}-${range[1]} of ${total} entries`,
    onChange: onPageChange,
    onShowSizeChange: (current, size) => {
      if (onPageChange) onPageChange(current, size);
    }
  } : false;

  return (
    <Card
      title={title}
      style={{ margin: '16px' }}
      extra={
        <Space wrap>
          {showSearch && (
            <Search
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              style={{ width: 250 }}
              allowClear
            />
          )}
          {extraButtons}
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={paginationConfig}
        scroll={{ x: true }}
        size="middle"
      />
      {deleteModal && (
        <ConfirmModal
          isOpen={getDeleteModalProps("isOpen")}
          title={getDeleteModalProps("title")}
          message={getDeleteModalProps("message")}
          onOk={getDeleteModalProps("onOk")}
          onCancel={getDeleteModalProps("onCancel")}
        />
      )}

      {formModal && (
        <CommonFormModal
          isModalOpen={getformModalProps("isOpen")}
          setIsModalOpen={getformModalProps("setIsModalOpen")}
          onSubmit={getformModalProps("onSubmit")}
          editingDept={null}
          title={getformModalProps("title")}
          fieldLabel={getformModalProps("fieldLabel")}

        />
      )}
    </Card>
  );
};

export default CommonTable;