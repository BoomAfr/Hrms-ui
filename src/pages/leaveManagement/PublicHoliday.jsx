import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PublicHolidayModal from '../../components/common/SharedModal/PublicHolidayModal';
import ConfirmModal from '../../components/common/SharedModal/ConfirmModal';
import { usePublicHoliday } from '../../hooks/usePublicHoliday';
import { manageHolidayAPI } from '../../services/manageHolidayServices';
import { useToast } from '../../hooks/useToast';

const { Option } = Select;

const PublicHoliday = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPublicHoliday, setSelectedPublicHoliday] = useState(null);
  const [editingPublicHoliday, setEditingPublicHoliday] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [holidaysOptions, setHolidaysOptions] = useState([]);
  const [total, setTotal] = useState(0);

  const {
    publicHolidays,
    loading,
    error,
    refetch,
    addPublicHoliday,
    updatePublicHoliday,
    deletePublicHoliday,
  } = usePublicHoliday();

  const { Toast, contextHolder } = useToast();

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const res = await manageHolidayAPI.getALLPage({ page: 1, page_size: 2000 });
        setHolidaysOptions(res.data);
      } catch (err) {
        console.error('Failed to load manage holidays', err);
      }
    };
    loadHolidays();
  }, []);

  const handleAddPublicHoliday = async (values) => {
    try {
      const payload = {
        holiday: values.holiday,
        start_date: values.start_date,
        end_date: values.end_date,
        comment: values.comment ?? '',
      };

      if (editingPublicHoliday) {
        await updatePublicHoliday(editingPublicHoliday.id, payload);
        Toast.success('Public holiday updated successfully');
      } else {
        await addPublicHoliday(payload);
        Toast.success('Public holiday added successfully');
      }

      refetch();
      setEditingPublicHoliday(null);
      setIsModalOpen(false);
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const loadDepartments = async (page = currentPage, size = pageSize, search = searchText) => {
    const data = await refetch(page, size, search);
    if (data && data.count !== undefined) setTotal(data.count);
  };

  useEffect(() => {
    loadDepartments(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    setCurrentPage(1);
  };

  const handleEdit = (record) => {
    const holidayField =
      record.holiday && typeof record.holiday === 'object'
        ? record.holiday.id
        : record.holiday ?? record.holiday_id ?? null;

    setEditingPublicHoliday({
      id: record.id ?? record.key,
      holiday: holidayField,
      start_date: record.start_date,
      end_date: record.end_date,
      comment: record.comment ?? '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedPublicHoliday(record);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPublicHoliday) return;
    try {
      await deletePublicHoliday(selectedPublicHoliday.id);
      Toast.success('Public holiday deleted successfully');
      refetch();
    } catch (err) {
      Toast.error('Failed to delete public holiday');
    } finally {
      setIsConfirmOpen(false);
      setSelectedPublicHoliday(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedPublicHoliday(null);
  };

  const handleAddNew = () => {
    setEditingPublicHoliday(null);
    setIsModalOpen(true);
  };

  const pagination = {
    current: currentPage,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

  const columns = [
    {
      title: 'S/L',
      dataIndex: 'sl',
      key: 'sl',
      width: 80,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Holiday Name',
      dataIndex: 'holiday_name',
      key: 'holiday_name',
      align: 'left',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      align: 'left',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      align: 'left',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      align: 'left',
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            className="table-action-btn table-action-btn-edit"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            className="table-action-btn table-action-btn-delete"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="table-page-container">
      {contextHolder}

      <Card
        className="table-page-card"
        title="Public Holiday List"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            className="table-page-add-btn"
          >
            Add New Public Holiday
          </Button>
        }
      >
        <Row className="table-page-filters" align="middle" justify="space-between">
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={pageSize}
              onChange={(value) => setPageSize(value)}
              className="table-page-select"
              style={{ width: 80, marginRight: 8 }}
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span>entries</span>
          </Col>

          <Col>
            <Input.Search
              placeholder="Search public holiday..."
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              className="table-page-search"
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <div className="table-page-table">
          <Table
            columns={columns}
            dataSource={publicHolidays
              .filter((p) =>
                (p.name?.toLowerCase() + ' ' + (p.comment ?? '')).includes(searchText)
              )
              .map((p, i) => ({
                key: p.id ?? i,
                id: p.id,
                sl: i + 1,
                holiday_name: p.name,
                start_date: p.start_date ?? '',
                end_date: p.end_date ?? '',
                comment: p.comment ?? '',
              }))}
            loading={loading}
            pagination={pagination}
            size="middle"
            bordered
            scroll={{ x: 700 }}
          />
        </div>
      </Card>

      {isModalOpen && (
        <PublicHolidayModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSubmit={handleAddPublicHoliday}
          editingPublicHoliday={editingPublicHoliday}
          title={editingPublicHoliday ? 'Edit Public Holiday' : 'Add Public Holiday'}
          holidaysOptions={holidaysOptions}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Public Holiday"
        message="Are you sure you want to delete this public holiday?"
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default PublicHoliday;