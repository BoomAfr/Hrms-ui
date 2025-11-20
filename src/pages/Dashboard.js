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
      color: '#1890ff'
    },
    {
      title: 'DEPARTMENT',
      value: dashboardData?.metrics?.total_department || 0,
      icon: <UserOutlined />,
      color: '#52c41a'
    },
    {
      title: 'PRESENT TODAY',
      value: dashboardData?.metrics?.present_today || 0,
      icon: <CheckCircleOutlined />,
      color: '#52c41a'
    },
    {
      title: 'ABSENT TODAY',
      value: dashboardData?.metrics?.absent_today || 0,
      icon: <ClockCircleOutlined />,
      color: '#ff4d4f'
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
    <Card style={{ borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <Skeleton.Input active size="small" style={{ width: '80%', marginBottom: '8px' }} />
          <Skeleton.Input active size="large" style={{ width: '60%' }} />
        </div>
        <Skeleton.Avatar active size={32} />
      </div>
    </Card>
  );

  const TableSkeleton = () => (
    <div>
      {[...Array(5)].map((_, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
          <Skeleton.Avatar active size="small" style={{ marginRight: '12px' }} />
          <div style={{ flex: 1 }}>
            <Skeleton.Input active size="small" style={{ width: '80%' }} />
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
        <div key={index} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
          <Skeleton active paragraph={{ rows: 1 }} />
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
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>Dashboard</Title>
      
      {/* Stats Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            {loading ? (
              <StatSkeleton />
            ) : (
              <Card 
                style={{ 
                  borderLeft: `4px solid ${stat.color}`,
                  borderRadius: '8px'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: '500' }}>
                      {stat.title}
                    </Text>
                    <Title 
                      level={2} 
                      style={{ 
                        margin: '8px 0 0 0', 
                        color: stat.color,
                        fontSize: '28px'
                      }}
                    >
                      {stat.value}
                    </Title>
                  </div>
                  <div 
                    style={{
                      fontSize: '32px',
                      color: stat.color,
                      opacity: 0.8
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card>
            )}
          </Col>
        ))}
      </Row>

      {/* Single Row for Notice Board, Check In/Out, and Today Attendance */}
      <Row gutter={[16, 16]}>
        {/* Notice Board - Left Side */}
        <Col xs={24} lg={6}>
          <Card 
            title={
              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                <BellOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                NOTICE BOARD
              </span>
            }
            style={{ borderRadius: '8px', height: '100%' }}
            bodyStyle={{ padding: '12px' }}
          >
            {loading ? (
              <NoticeSkeleton />
            ) : noticeData.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={noticeData}
                size="small"
                renderItem={item => (
                  <List.Item
                    style={{
                      borderLeft: '3px solid #1890ff',
                      paddingLeft: '8px',
                      marginBottom: '8px',
                      backgroundColor: '#fafafa',
                      borderRadius: '4px',
                      padding: '8px'
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong style={{ fontSize: '13px' }}>{item.title}</Text>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {item.date}
                          </Text>
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '2px' }}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              Published By: {item.publishedBy}
                            </Text>
                          </div>
                          <Text style={{ fontSize: '12px' }}>
                            {item.description}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No notices available"
                imageStyle={{ height: 40 }}
              />
            )}
          </Card>
        </Col>

        {/* Check In/Out Card - Middle */}
        <Col xs={24} lg={6}>
          <Card 
            style={{ borderRadius: '8px', height: '100%' }}
            bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
          >
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ marginBottom: '8px', color: '#1890ff', fontSize: '16px' }}>
                CHECK IN/OUT
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontSize: '12px' }}>
                Your IP is 49.3/24.192
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                {!isCheckedIn ? (
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    size="middle"
                    onClick={handleCheckIn}
                    style={{ minWidth: '100px' }}
                  >
                    Check In
                  </Button>
                ) : (
                  <Button 
                    danger
                    icon={<LogoutOutlined />} 
                    size="middle"
                    onClick={handleCheckOut}
                    style={{ minWidth: '100px' }}
                  >
                    Check Out
                  </Button>
                )}
                {isCheckedIn && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                    <Text strong style={{ fontSize: '12px' }}>Checked In: {formatTime(checkInTime)}</Text>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>

        {/* Today Attendance Table - Right Side */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                TODAY ATTENDANCE
              </span>
            }
            style={{ borderRadius: '8px', height: '100%' }}
            bodyStyle={{ padding: '12px' }}
          >
            {loading ? (
              <TableSkeleton />
            ) : dashboardData?.today_attendance_list?.length > 0 ? (
              <Table 
                columns={attendanceColumns}
                dataSource={dashboardData.today_attendance_list}
                pagination={false}
                scroll={{ x: 400 }}
                size="small"
                style={{ fontSize: '12px' }}
              />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No attendance records for today"
                imageStyle={{ height: 40 }}
              />
            )}
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;