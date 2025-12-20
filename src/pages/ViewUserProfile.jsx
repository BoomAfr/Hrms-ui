import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Avatar, Row, Col, Skeleton, Tooltip, Divider, Button, Modal, Form, Input, Upload, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BankOutlined,
  BookOutlined,
  GlobalOutlined,
  WomanOutlined,
  ManOutlined,
  ShoppingOutlined,
  BlockOutlined,
  CheckCircleOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useUserProfile } from '../hooks/useUserProfile';
import '../styles/design-system.css';
import '../styles/table-pages.css';
import './ViewUserProfile.css';

const ViewUserProfile = () => {
  const { profile: userData, loading, updateProfile } = useUserProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const profile = userData?.profile;
  const role = userData?.role;

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        address: profile.address,
      });
    }
  }, [profile, form]);

  const handleUpdate = async (values) => {
    setUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('phone', values.phone);
      formData.append('address', values.address || '');

      if (fileList.length > 0) {
        formData.append('photo', fileList[0].originFileObj);
      }

      await updateProfile(formData);
      setIsEditModalOpen(false);
      setFileList([]);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/JPEG file!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; 
    },
    fileList,
    maxCount: 1,
    accept: ".jpg,.jpeg",
  };

  const educationColumns = [
    {
      title: 'Institute',
      dataIndex: 'institute',
      key: 'institute',
      render: (text) => <span style={{ fontWeight: 500 }}>{text || '--'}</span>,
    },
    {
      title: 'Degree',
      dataIndex: 'degree',
      key: 'degree',
      render: (text) => <Tag color="blue">{text || '--'}</Tag>,
    },
    {
      title: 'Passing Year',
      dataIndex: 'passing_year',
      key: 'passing_year',
    },
    {
      title: 'GPA / Result',
      dataIndex: 'gpa',
      key: 'gpa',
      render: (text, record) => <Tag color="cyan">{text || record.result || '--'}</Tag>,
    },
  ];

  const experienceColumns = [
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
      render: (text) => <span style={{ fontWeight: 500 }}>{text || '--'}</span>,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      render: (text) => <Tag color="gold">{text || '--'}</Tag>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {skills?.map((skill, index) => (
            <Tag key={index} color="geekblue">{skill}</Tag>
          )) || '--'}
        </div>
      ),
    },
  ];

  const accountColumns = [
    {
      title: 'Bank Name',
      dataIndex: 'bank_name',
      key: 'bank_name',
      render: (text) => <span><BankOutlined style={{ marginRight: 8, color: '#1890ff' }} />{text || '--'}</span>,
    },
    {
      title: 'Account Number',
      dataIndex: 'account_number',
      key: 'account_number',
      render: (text) => <code style={{ color: '#c41d7f' }}>{text || '--'}</code>,
    },
    {
      title: 'IFSC Code',
      dataIndex: 'ifsc_code',
      key: 'ifsc_code',
    },
    {
      title: 'Status',
      dataIndex: 'is_primary',
      key: 'is_primary',
      render: (is_primary) => (
        is_primary ?
          <Tag color="success" icon={<CheckCircleOutlined />}>Primary</Tag> :
          <Tag color="default">Secondary</Tag>
      ),
    },
  ];

  const InfoItem = ({ label, value, icon }) => (
    <div className="self-info-item">
      <span className="self-info-label">{label}</span>
      <div className="self-info-value">
        {icon && <span className="stat-icon" style={{ color: 'var(--primary-500)' }}>{icon}</span>}
        {value || '--'}
      </div>
    </div>
  );

  return (
    <div className="self-profile-container">
      {/* Profile Header */}
      <div className="self-profile-header-card">
        <div className="self-profile-header-banner"></div>
        <div className="self-profile-header-content">
          <div className="self-profile-avatar-wrapper">
            {loading ? (
              <Skeleton.Avatar active size={140} shape="circle" />
            ) : (
              <Avatar
                size={140}
                src={profile?.photo}
                icon={<UserOutlined />}
                style={{ backgroundColor: 'var(--primary-500)', border: '6px solid white' }}
              />
            )}
          </div>
          <div className="self-profile-main-info">
            {loading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h1 className="self-profile-name">
                      {profile?.first_name} {profile?.last_name}
                    </h1>
                    <div className="self-profile-role-badge">
                      <BlockOutlined style={{ marginRight: 6 }} />
                      {role?.name || 'User'}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="large"
                    className="gradient-primary"
                    style={{ borderRadius: 'var(--radius-md)', border: 'none' }}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
                <div className="self-profile-quick-stats">
                  <div className="self-stat-item">
                    <MailOutlined style={{ color: 'var(--primary-500)' }} /> {userData?.email}
                  </div>
                  <div className="self-stat-item">
                    <PhoneOutlined style={{ color: 'var(--primary-500)' }} /> {profile?.phone}
                  </div>
                  <div className="self-stat-item">
                    <EnvironmentOutlined style={{ color: 'var(--primary-500)' }} /> {profile?.address}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Column */}
        <Col xs={24} lg={17}>
          {/* Educational Qualification */}
          <Card
            title={<div className="self-section-title"><BookOutlined /> EDUCATIONAL QUALIFICATION</div>}
            className="table-page-card self-detail-section-card"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={educationColumns}
                dataSource={userData?.education}
                pagination={false}
                className="table-page-table"
                size="middle"
                locale={{ emptyText: 'No educational history found' }}
              />
            )}
          </Card>

          {/* Professional Experience */}
          <Card
            title={<div className="self-section-title"><ShoppingOutlined /> PROFESSIONAL EXPERIENCE</div>}
            className="table-page-card self-detail-section-card"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={experienceColumns}
                dataSource={userData?.experience}
                pagination={false}
                className="table-page-table"
                size="middle"
                locale={{ emptyText: 'No professional experience found' }}
              />
            )}
          </Card>

          {/* Account Details */}
          <Card
            title={<div className="self-section-title"><BankOutlined /> ACCOUNT DETAILS</div>}
            className="table-page-card self-detail-section-card"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={accountColumns}
                dataSource={userData?.account_details}
                pagination={false}
                className="table-page-table"
                size="middle"
                locale={{ emptyText: 'No bank account details found' }}
              />
            )}
          </Card>
        </Col>

        {/* Sidebar Column */}
        <Col xs={24} lg={7}>
          <Card
            title={<div className="self-section-title"><UserOutlined /> PERSONAL INFO</div>}
            className="table-page-card"
            style={{ position: 'sticky', top: 24 }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 10 }} />
            ) : (
              <div className="self-info-grid" style={{ gridTemplateColumns: '1fr' }}>
                <InfoItem
                  label="Gender"
                  value={profile?.gender}
                  icon={profile?.gender?.toLowerCase() === 'female' ? <WomanOutlined /> : <ManOutlined />}
                />
                <InfoItem label="Religion" value={profile?.religion} icon={<GlobalOutlined />} />
                <InfoItem label="Marital Status" value={profile?.marital_status} />
                <Divider style={{ margin: '12px 0' }} />
                <InfoItem label="Employee ID" value={profile?.employee_id} icon={<BlockOutlined />} />
                <InfoItem label="Joining Date" value={profile?.date_of_joining} icon={<CalendarOutlined />} />
                <InfoItem label="Job Status" value={<Tag color="processing">{profile?.job_status}</Tag>} />
                <Divider style={{ margin: '12px 0' }} />
                <InfoItem label="Emergency Contact" value={profile?.emergency_contact} />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      
      <Modal
        title={<h3><EditOutlined style={{ color: 'var(--primary-500)' }} /> Edit Personal Information</h3>}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            first_name: profile?.first_name,
            last_name: profile?.last_name,
            phone: profile?.phone,
            address: profile?.address,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="Enter phone number" prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} />
          </Form.Item>

          <Form.Item
            name="photo"
            label="Profile Photo"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Click to Upload (JPG/JPEG only)</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea rows={3} placeholder="Enter your full address" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateLoading}
              icon={<SaveOutlined />}
              className="gradient-primary"
              style={{ border: 'none' }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewUserProfile;
