import React, { useState } from 'react';
import { Typography, Tabs, Row, Col, Button } from 'antd';
import { CheckCircleFilled, ArrowRightOutlined } from '@ant-design/icons';
import employeeListImg from '../../assets/landing/employee-list.png';
import attendanceImg from '../../assets/landing/attendance.png';
import payrollImg from '../../assets/landing/payroll.png';

const { Title, Paragraph } = Typography;

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState('1');

  const items = [
    {
      key: '1',
      label: 'Employee Management',
      title: 'Complete Employee Database',
      description: 'Keep all your employee data in one secure place. From personal details to documents, manage everything with ease.',
      features: ['Digital Employee Profiles', 'Document Storage', 'Role Management', 'Department Organization'],
      image: employeeListImg,
      color: '#1677ff'
    },
    {
      key: '2',
      label: 'Smart Payroll',
      title: 'Run Payroll in Minutes',
      description: 'Automate your entire payroll process. Calculate taxes, deductions, and bonuses automatically without errors.',
      features: ['Automated Tax Calculations', 'Direct Deposit', 'Payslip Generation', 'Bonus Management'],
      image: payrollImg,
      color: '#722ed1'
    },
    {
      key: '3',
      label: 'Attendance',
      title: 'Track Time Effortlessly',
      description: 'Monitor attendance, leaves, and overtime in real-time. Integrate seamlessly with biometric devices.',
      features: ['Real-time Tracking', 'Leave Management', 'Overtime Calculation', 'Shift Scheduling'],
      image: attendanceImg,
      color: '#52c41a'
    }
  ];

  const currentItem = items.find(item => item.key === activeTab);

  return (
    <div style={{ padding: 'clamp(40px, 8vw, 100px) 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <Title level={2} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '16px' }}>
            Powerful features for <span className="gradient-text">Growing Teams</span>
          </Title>
          <Paragraph style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Switch between tabs to see how our platform handles your most critical HR tasks.
          </Paragraph>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          size="large"
          type="card"
          items={items.map(item => ({ key: item.key, label: item.label }))}
          style={{ marginBottom: 'clamp(24px, 5vw, 48px)' }}
          className="showcase-tabs"
        />

        <div className="glass-panel showcase-content" style={{
          padding: 'clamp(24px, 5vw, 48px)',
          borderRadius: 'clamp(16px, 4vw, 32px)'
        }}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={10} style={{ order: { xs: 2, md: 1 } }}>
              <div style={{ transition: 'all 0.3s ease' }}>
                <Title level={3} style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '24px' }}>
                  {currentItem.title}
                </Title>
                <Paragraph style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#64748b', marginBottom: '32px', lineHeight: 1.8 }}>
                  {currentItem.description}
                </Paragraph>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  {currentItem.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 500 }}>
                      <CheckCircleFilled style={{ color: currentItem.color, fontSize: 'clamp(18px, 3vw, 20px)' }} />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  style={{
                    background: currentItem.color,
                    height: 'clamp(44px, 6vw, 48px)',
                    fontSize: 'clamp(14px, 2vw, 16px)',
                    borderRadius: '12px'
                  }}
                  block
                  className="mobile-block-button"
                >
                  Learn more about {currentItem.label}
                </Button>
              </div>
            </Col>
            <Col xs={24} md={14} style={{ order: { xs: 1, md: 2 } }}>
              <div
                className="hero-image-container"
                style={{
                  boxShadow: `0 20px 50px -12px ${currentItem.color}40`,
                  border: 'none',
                  animation: 'none'
                }}
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  style={{ width: '100%', display: 'block', borderRadius: '16px' }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
