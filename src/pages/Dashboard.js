import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Typography,
  Divider,
  Avatar,
  List,
  Badge,
  Statistic,
  Skeleton,
  Empty,
  Alert
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useDashboard } from '../hooks/useDashboard';
import './Dashboard.css';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const { dashboardData, loading, error } = useDashboard();

  console.log(dashboardData, 'dashboardData');

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    setCheckInTime(null);
    setIsCheckedIn(false);
  };

  const formatTime = (date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Stats data from API response
  const statsData = [
    {
      title: 'TOTAL EMPLOYEE',
      value: dashboardData?.metrics?.total_employee || 0,
      icon: <TeamOutlined />,
      className: 'stat-card-primary'
    },
    {
      title: 'DEPARTMENT',
      value: dashboardData?.metrics?.total_department || 0,
      icon: <UserOutlined />,
      className: 'stat-card-success'
    },
    {
      title: 'PRESENT TODAY',
      value: dashboardData?.metrics?.present_today || 0,
      icon: <CheckCircleOutlined />,
      className: 'stat-card-warning' // Changed to warning for visual variety as per plan
    },
    {
      title: 'ABSENT TODAY',
      value: dashboardData?.metrics?.absent_today || 0,
      icon: <ClockCircleOutlined />,
      className: 'stat-card-danger'
    }
  ];

  // Table columns for attendance
  const attendanceColumns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: (photo, record) => (
        <Avatar
          size="small"
          src={photo}
          icon={<UserOutlined />}
        />
      ),
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'In Time',
      dataIndex: 'in_time',
      key: 'in_time',
    },
    {
      title: 'Out Time',
      dataIndex: 'out_time',
      key: 'out_time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          'Present': { color: 'green', text: 'Present' },
          'Late': { color: 'orange', text: 'Late' },
          'Absent': { color: 'red', text: 'Absent' },
          'Half Day': { color: 'blue', text: 'Half Day' }
        };

        const config = statusConfig[status] || { color: 'default', text: status };
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
  ];

  // Notice board data from API
  const noticeData = dashboardData?.notice_board ? [dashboardData.notice_board] : [];

  // Loading Skeleton Components
  const StatSkeleton = () => (
    <Card style={{ borderRadius: '16px', border: 'none' }} bodyStyle={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <Skeleton.Input active size="small" style={{ width: '80%', marginBottom: '12px' }} />
          <Skeleton.Input active size="large" style={{ width: '60%', height: '40px' }} />
        </div>
        <Skeleton.Avatar active size={48} shape="circle" />
      </div>
    </Card>
  );

  const TableSkeleton = () => (
    <div>
      {[...Array(5)].map((_, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Skeleton.Avatar active size="small" style={{ marginRight: '16px' }} />
          <div style={{ flex: 1 }}>
            <Skeleton.Input active size="small" style={{ width: '60%' }} />
          </div>
          <Skeleton.Input active size="small" style={{ width: '60px', marginRight: '12px' }} />
          <Skeleton.Input active size="small" style={{ width: '60px', marginRight: '12px' }} />
          <Skeleton.Input active size="small" style={{ width: '80px' }} />
        </div>
      ))}
    </div>
  );

  const NoticeSkeleton = () => (
    <div>
      {[...Array(2)].map((_, index) => (
        <div key={index} style={{ marginBottom: '16px', padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
          <Skeleton active paragraph={{ rows: 2 }} title={{ width: '70%' }} />
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error Loading Dashboard"
          description="There was an error loading the dashboard data. Please try again later."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <Title level={2} className="dashboard-title">Dashboard Overview</Title>

      
      <div className="stat-cards-container">
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          
          <Col xs={24} sm={12} lg={6}>
            {loading ? <StatSkeleton /> : (
              <Card className="stat-card card-purple" bodyStyle={{ padding: '24px' }}>
                <div className="stat-card-content">
                  <div>
                    <span className="stat-card-label">Total Departments</span>
                    <h3 className="stat-card-value">{dashboardData?.metrics?.total_department || 0}</h3>
                    <div className="stat-card-footer">
                       <span>Good Teamwork will give good results</span>
                    </div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <TeamOutlined className="stat-card-icon" />
                  </div>
                </div>
              </Card>
            )}
          </Col>

         
          <Col xs={24} sm={12} lg={6}>
            {loading ? <StatSkeleton /> : (
              <Card className="stat-card card-pink" bodyStyle={{ padding: '24px' }}>
                <div className="stat-card-content">
                  <div>
                    <span className="stat-card-label">Total Employees</span>
                    <h3 className="stat-card-value">{dashboardData?.metrics?.total_employee || 0}</h3>
                    <div className="stat-card-footer">
                       <span>Employees are the soul of company</span>
                    </div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <UserOutlined className="stat-card-icon" />
                  </div>
                </div>
              </Card>
            )}
          </Col>

          
          <Col xs={24} sm={12} lg={6}>
            {loading ? <StatSkeleton /> : (
              <Card className="stat-card card-green" bodyStyle={{ padding: '24px' }}>
                <div className="stat-card-content">
                  <div>
                    <span className="stat-card-label">Present Today</span>
                    <h3 className="stat-card-value">{dashboardData?.metrics?.present_today || 0}</h3>
                    <div className="stat-card-footer">
                      <RiseOutlined /> <span>On time today</span>
                    </div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <CheckCircleOutlined className="stat-card-icon" />
                  </div>
                </div>
              </Card>
            )}
          </Col>

          
          <Col xs={24} sm={12} lg={6}>
            {loading ? <StatSkeleton /> : (
              <Card className="stat-card card-orange" bodyStyle={{ padding: '24px' }}>
                <div className="stat-card-content">
                  <div>
                    <span className="stat-card-label">Absent Today</span>
                    <h3 className="stat-card-value">{dashboardData?.metrics?.absent_today || 0}</h3>
                    <div className="stat-card-footer">
                      <ExclamationCircleOutlined /> <span>Needs attention</span>
                    </div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <ClockCircleOutlined className="stat-card-icon" />
                  </div>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>

      
      <Row gutter={[24, 24]}>
        
        <Col xs={24} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            className="notice-card"
            title={
              <span className="notice-card-title">
                <BellOutlined className="notice-card-icon" />
                ANNOUNCEMENTS
              </span>
            }
            style={{ height: '100%', flex: 1 }}
            bodyStyle={{ padding: '16px', height: 'calc(100% - 58px)', overflowY: 'auto' }}
          >
            {loading ? (
              <NoticeSkeleton />
            ) : noticeData.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={noticeData}
                split={false}
                renderItem={item => (
                  <List.Item
                    className="notice-list-item"
                    style={{ border: 'none' }}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <Text strong className="notice-title">{item.title}</Text>
                        <Text className="notice-date">
                          {item.date}
                        </Text>
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <Text type="secondary" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                          From: {item.publishedBy}
                        </Text>
                      </div>
                      <Text className="notice-description">
                        {item.description}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span style={{ color: '#9ca3af' }}>No new announcements</span>}
                />
              </div>
            )}
          </Card>
        </Col>

        
        <Col xs={24} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            className="checkin-card"
            bordered={false}
            bodyStyle={{ padding: '0', height: '100%' }}
          >
            <div className="checkin-card-body">
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <Title level={4} className="checkin-title">
                  ATTENDANCE
                </Title>
                <Text className="checkin-ip">
                  IP: 49.3/24.192
                </Text>
                <div className="checkin-actions">
                  {!isCheckedIn ? (
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      size="large"
                      onClick={handleCheckIn}
                      className="checkin-button"
                      style={{ background: 'white', color: '#6366f1' }}
                    >
                      Check In
                    </Button>
                  ) : (
                    <Button
                      danger
                      icon={<LogoutOutlined />}
                      size="large"
                      onClick={handleCheckOut}
                      className="checkin-button"
                      style={{ background: 'white', color: '#ef4444', border: 'none' }}
                    >
                      Check Out
                    </Button>
                  )}
                  {isCheckedIn && (
                    <div className="checkin-status">
                      <CheckCircleOutlined />
                      <span>In: {formatTime(checkInTime)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        
        <Col xs={24} lg={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            className="attendance-card"
            title={
              <span className="attendance-card-title">
                <ClockCircleOutlined className="attendance-card-icon" />
                TODAY'S ACTIVITY
              </span>
            }
            style={{ height: '100%', flex: 1 }}
            bodyStyle={{ padding: '0', overflow: 'hidden' }}
          >
            {loading ? (
              <div style={{ padding: '16px' }}>
                <TableSkeleton />
              </div>
            ) : dashboardData?.today_attendance_list?.length > 0 ? (
              <Table
                className="attendance-table"
                columns={attendanceColumns}
                dataSource={dashboardData.today_attendance_list}
                pagination={false}
                scroll={{ x: 400, y: 280 }}
                size="middle"
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span style={{ color: '#9ca3af' }}>No activity today</span>}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;