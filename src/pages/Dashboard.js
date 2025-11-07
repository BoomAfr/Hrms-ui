import React, { useState } from 'react';
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
  Badge
} from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

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

  // Table columns for attendance
  const attendanceColumns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: () => <Avatar size="small" icon={<UserOutlined />} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'In Time',
      dataIndex: 'inTime',
      key: 'inTime',
    },
    {
      title: 'Out Time',
      dataIndex: 'outTime',
      key: 'outTime',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Late' ? 'red' : 'green'}>
          {status}
        </Tag>
      ),
    },
  ];

  // Empty data for the table
  const attendanceData = [];

  // Notice board data
  const noticeData = [
    {
      title: 'Meeting',
      date: '12 Mar 2025',
      publishedBy: 'Admin',
      description: 'Dissertations',
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2}>Dashboard</Title>
      
      {/* Stats Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">TOTAL EMPLOYEE</Text>
                <Title level={3} style={{ margin: '8px 0 0 0' }}>ent</Title>
              </div>
              <TeamOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Today Attendance</Text>
                <div style={{ marginTop: '8px' }}>
                  {isCheckedIn ? (
                    <div>
                      <div>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        <Text strong>Checked In: {formatTime(checkInTime)}</Text>
                      </div>
                    </div>
                  ) : (
                    <Text type="secondary">Not Checked In</Text>
                  )}
                </div>
              </div>
              <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ marginBottom: '8px' }}>
                HEY ADMIN PLEASE CHECK IN/OUT YOUR ATTENDANCE
              </Title>
              <Text type="secondary">Your IP is 49.3/24.192</Text>
              <div style={{ marginTop: '16px' }}>
                {!isCheckedIn ? (
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    size="large"
                    onClick={handleCheckIn}
                    block
                  >
                    Check In
                  </Button>
                ) : (
                  <Button 
                    danger
                    icon={<LogoutOutlined />} 
                    size="large"
                    onClick={handleCheckOut}
                    block
                  >
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Attendance Table */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: '8px' }} />
                Today Attendance
              </span>
            }
          >
            <Table 
              columns={attendanceColumns}
              dataSource={attendanceData}
              locale={{
                emptyText: 'No data available'
              }}
              pagination={false}
              scroll={{ x: 500 }}
            />
          </Card>
        </Col>

        {/* Department & Notice Board */}
        <Col xs={24} lg={8}>
          <Row gutter={[0, 16]}>
            {/* Department Section */}
            <Col span={24}>
              <Card 
                title={
                  <span>
                    <TeamOutlined style={{ marginRight: '8px' }} />
                    DEPARTMENT
                  </span>
                }
              >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Title level={3} type="success">PRESENT</Title>
                  <Text type="secondary">Department status overview</Text>
                </div>
              </Card>
            </Col>

            {/* Notice Board */}
            <Col span={24}>
              <Card 
                title={
                  <span>
                    <BellOutlined style={{ marginRight: '8px' }} />
                    NOTICE BOARD
                  </span>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={noticeData}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={
                          <div>
                            <div>
                              <Text type="secondary">Published Date: {item.date}</Text>
                            </div>
                            <div>
                              <Text type="secondary">Publish By: {item.publishedBy}</Text>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                              <Text>{item.description}</Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;