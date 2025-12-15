import React from 'react';
import { Typography, Button, Row, Col, Space } from 'antd';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import dashboardImg from '../../assets/landing/dashboard.png';

const { Title, Paragraph } = Typography;

const Hero = () => {
  return (
    <div style={{
      padding: 'clamp(40px, 8vw, 100px) 24px',
      background: 'radial-gradient(circle at 50% 50%, #f0f5ff 0%, #ffffff 100%)',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={11} style={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: '#e6f4ff',
                  color: '#1677ff',
                  borderRadius: '30px',
                  fontWeight: '600',
                  marginBottom: '24px',
                  fontSize: 'clamp(12px, 2vw, 16px)'
                }}>
                  🚀 The Future of HR is Here
                </div>
                <Title level={1} style={{
                  fontSize: 'clamp(2rem, 6vw, 4rem)',
                  marginBottom: '24px',
                  lineHeight: 1.1
                }}>
                  Manage your team with <span className="gradient-text">Confidence</span>
                </Title>
                <Paragraph style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  color: '#64748b',
                  maxWidth: '500px',
                  lineHeight: 1.8,
                  margin: '0 auto'
                }}>
                  Experience the most intuitive HRMS platform. From payroll to performance, we've simplified everything so you can focus on your people.
                </Paragraph>
              </div>
              <Space size="middle" wrap style={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  style={{
                    height: 'clamp(48px, 8vw, 56px)',
                    padding: '0 clamp(20px, 4vw, 32px)',
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    borderRadius: '12px'
                  }}
                >
                  Book a Demo
                </Button>
                <Button
                  size="large"
                  icon={<PlayCircleOutlined />}
                  style={{
                    height: 'clamp(48px, 8vw, 56px)',
                    padding: '0 clamp(20px, 4vw, 32px)',
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    borderRadius: '12px'
                  }}
                >
                  Start For Free
                </Button>
              </Space>
              <div className="hero-features" style={{
                marginTop: '32px',
                display: 'flex',
                gap: 'clamp(12px, 3vw, 24px)',
                color: '#94a3b8',
                fontSize: 'clamp(12px, 2vw, 16px)',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                <div>✓ No credit card required</div>
                <div>✓ 14-day free trial</div>
                <div>✓ Cancel anytime</div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={13}>
            <div className="hero-image-container">
              <img
                src={dashboardImg}
                alt="HRMS Dashboard"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Hero;
