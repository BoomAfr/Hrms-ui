import React, { useEffect } from 'react';
import { Card, Table, Tag, Avatar, Row, Col, Skeleton, Button, Tooltip } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  BookOutlined,
  GlobalOutlined,
  WomanOutlined,
  ManOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useManageEmployee } from '../hooks/useManageEmployee';
import { useEducational } from '../hooks/useEducational';
import { useExperiences } from '../hooks/useExperiences';
import { useAccounts } from '../hooks/useAccounts';

// Import local styles
import '../styles/design-system.css';
import '../styles/table-pages.css';
import './employeeDetails.css';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchEmployeeById, loading, profile } = useManageEmployee();
  const { educationals, refetch } = useEducational();
  const { experiences, fetchExperience } = useExperiences();
  const { accounts, fetchAccounts } = useAccounts();

  useEffect(() => {
    if (id) {
      fetchEmployeeById(id);
      fetchExperience(id);
      fetchAccounts(id);
      refetch(id);
    }
  }, [id]);

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
      title: 'Board / University',
      dataIndex: 'board',
      key: 'board',
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'GPA / CGPA',
      dataIndex: 'gpa',
      key: 'gpa',
      render: (text) => <Tag color="cyan">{text || '--'}</Tag>,
    },
    {
      title: 'Passing Year',
      dataIndex: 'passing_year',
      key: 'passing_year',
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
      title: 'Skill',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => (
        skills && skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {skills.map((skill, index) => (
              <Tag key={index} color="geekblue" style={{ borderRadius: '4px' }}>
                {skill}
              </Tag>
            ))}
          </div>
        ) : '--'
      ),
    },
    {
      title: 'Responsibility',
      dataIndex: 'responsibility',
      key: 'responsibility',
      ellipsis: true,
    },
  ];

  const accountColumns = [
    {
      title: 'Account Holder',
      dataIndex: 'account_holder_name',
      key: 'account_holder_name',
      render: (text) => <span style={{ fontWeight: 500 }}>{text || '--'}</span>,
    },
    {
      title: 'Bank Name',
      dataIndex: 'bank_name',
      key: 'bank_name',
      render: (text) => (
        <span>
          <BankOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {text || '--'}
        </span>
      ),
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
      title: 'Primary',
      dataIndex: 'is_primary',
      key: 'is_primary',
      render: (is_primary) => (
        is_primary ?
          <Tag color="success" style={{ borderRadius: '12px' }}>Primary</Tag> :
          <Tag color="default" style={{ borderRadius: '12px' }}>Secondary</Tag>
      ),
    },
  ];

  const InfoItem = ({ label, value, icon }) => (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <div className="info-value">
        {icon && <span className="stat-icon">{icon}</span>}
        {value || '--'}
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-header-banner"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            {loading ? (
              <Skeleton.Avatar active size={120} shape="circle" />
            ) : (
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{ backgroundColor: 'var(--primary-500)', border: '4px solid white' }}
              />
            )}
          </div>
          <div className="profile-main-info">
            {loading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <h1 className="profile-name">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <div className="profile-quick-stats">
                  <div className="stat-item">
                    <MailOutlined className="stat-icon" /> {profile?.email}
                  </div>
                  <div className="stat-item">
                    <PhoneOutlined className="stat-icon" /> {profile?.phone}
                  </div>
                  <div className="stat-item">
                    <EnvironmentOutlined className="stat-icon" /> {profile?.address}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Content Area */}
        <Col xs={24} lg={16}>
          {/* Educational Qualification Section */}
          <Card
            title={<div className="section-title"><BookOutlined /> EDUCATIONAL QUALIFICATION</div>}
            className="table-page-card detail-section-card"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={educationColumns}
                dataSource={profile?.education}
                pagination={false}
                className="table-page-table"
                locale={{ emptyText: 'No educational data available' }}
                size="middle"
              />
            )}
          </Card>

          {/* Professional Experience Section */}
          <Card
            title={<div className="section-title"><ShoppingOutlined /> PROFESSIONAL EXPERIENCE</div>}
            className="table-page-card detail-section-card"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={experienceColumns}
                dataSource={profile?.experience}
                pagination={false}
                className="table-page-table"
                locale={{ emptyText: 'No experience data available' }}
                size="middle"
              />
            )}
          </Card>

          {/* Account Details Section */}
          <Card
            title={<div className="section-title"><BankOutlined /> ACCOUNT DETAILS</div>}
            className="table-page-card detail-section-card"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={accountColumns}
                dataSource={accounts}
                pagination={false}
                className="table-page-table"
                locale={{ emptyText: 'No account details available' }}
                size="middle"
              />
            )}
          </Card>
        </Col>

        {/* Sidebar Space */}
        <Col xs={24} lg={8}>
          <Card
            title={<div className="section-title"><UserOutlined /> PERSONAL INFORMATION</div>}
            className="table-page-card"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 10 }} />
            ) : (
              <div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>
                <InfoItem
                  label="Gender"
                  value={profile?.gender}
                  icon={profile?.gender?.toLowerCase() === 'female' ? <WomanOutlined /> : <ManOutlined />}
                />
                <InfoItem label="Date of Birth" value={profile?.date_of_birth} icon={<CalendarOutlined />} />
                <InfoItem label="Date of Joining" value={profile?.date_of_joining} icon={<CalendarOutlined />} />
                <InfoItem label="Religion" value={profile?.religion} icon={<GlobalOutlined />} />
                <InfoItem label="Address" value={profile?.address} icon={<EnvironmentOutlined />} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
