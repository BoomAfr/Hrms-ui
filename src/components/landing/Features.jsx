import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import {
  TeamOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
  ScheduleOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const features = [
  {
    title: 'Smart Payroll',
    description: 'Automate tax calculations and filings. Pay your team in minutes, not days.',
    icon: <BankOutlined style={{ fontSize: 'clamp(28px, 5vw, 32px)', color: '#1677ff' }} />,
  },
  {
    title: 'Benefits Management',
    description: 'Offer world-class health, dental, and vision insurance to your employees.',
    icon: <HeartOutlined style={{ fontSize: 'clamp(28px, 5vw, 32px)', color: '#1677ff' }} />,
  },
  {
    title: 'Time & Attendance',
    description: 'Track hours, manage time off requests, and sync with payroll automatically.',
    icon: <ScheduleOutlined style={{ fontSize: 'clamp(28px, 5vw, 32px)', color: '#1677ff' }} />,
  },
  {
    title: 'Onboarding',
    description: 'Create a great first impression with digital offer letters and self-onboarding.',
    icon: <TeamOutlined style={{ fontSize: 'clamp(28px, 5vw, 32px)', color: '#1677ff' }} />,
  },
  {
    title: 'Compliance',
    description: 'Stay compliant with federal, state, and local labor laws automatically.',
    icon: <SafetyCertificateOutlined style={{ fontSize: 'clamp(28px, 5vw, 32px)', color: '#1677ff' }} />,
  },
  {
    title: 'Performance',
    description: 'Build high-performing teams with reviews, goals, and feedback tools.',
    icon: <RiseOutlined style={{ fontSize: 'clamp(28px, 5vw, 32px)', color: '#1677ff' }} />,
  },
];

const Features = () => {
  return (
    <div style={{ padding: 'clamp(40px, 8vw, 100px) 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}>
          <Title level={2} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>Everything you need to manage your team</Title>
          <Paragraph style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
            Our platform brings together all the tools you need to hire, pay, and manage your workforce in one easy-to-use system.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card
                className="feature-card"
                style={{ height: '100%', borderRadius: '24px', border: 'none' }}
                bodyStyle={{ padding: 'clamp(24px, 4vw, 40px) clamp(20px, 3vw, 32px)' }}
              >
                <div style={{
                  width: 'clamp(56px, 10vw, 64px)',
                  height: 'clamp(56px, 10vw, 64px)',
                  background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  {feature.icon}
                </div>
                <Title level={4} style={{ marginBottom: '16px', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>{feature.title}</Title>
                <Paragraph type="secondary" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: 1.6, marginBottom: 0 }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Features;
