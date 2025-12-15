import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { TwitterOutlined, LinkedinOutlined, FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import logo from '../../assets/landing/logo1.png';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ background: '#f8fafc', padding: 'clamp(40px, 8vw, 80px) 24px clamp(24px, 4vw, 40px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} md={8}>
            <div style={{ marginBottom: '24px', textAlign: { xs: 'center', md: 'left' } }}>
              <img src={logo} alt="HRMS Logo" style={{ height: 'clamp(32px, 6vw, 40px)', marginBottom: '16px' }} />
              <Text type="secondary" style={{ display: 'block', maxWidth: '300px', fontSize: 'clamp(14px, 2vw, 16px)', margin: { xs: '0 auto', md: '0' } }}>
                Making work easier for everyone. The modern HR platform for forward-thinking companies.
              </Text>
            </div>
            <Space size="large" style={{ justifyContent: { xs: 'center', md: 'flex-start' }, width: { xs: '100%', md: 'auto' } }}>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(18px, 3vw, 20px)' }}><TwitterOutlined /></Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(18px, 3vw, 20px)' }}><LinkedinOutlined /></Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(18px, 3vw, 20px)' }}><FacebookOutlined /></Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(18px, 3vw, 20px)' }}><InstagramOutlined /></Link>
            </Space>
          </Col>

          <Col xs={12} sm={8} md={5}>
            <Title level={5} style={{ marginBottom: '24px', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Product</Title>
            <Space direction="vertical" size="middle">
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Features</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Pricing</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Security</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Integrations</Link>
            </Space>
          </Col>

          <Col xs={12} sm={8} md={5}>
            <Title level={5} style={{ marginBottom: '24px', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Company</Title>
            <Space direction="vertical" size="middle">
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>About Us</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Careers</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Blog</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Contact</Link>
            </Space>
          </Col>

          <Col xs={24} sm={8} md={6}>
            <Title level={5} style={{ marginBottom: '24px', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Resources</Title>
            <Space direction="vertical" size="middle">
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Help Center</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>API Documentation</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Community</Link>
              <Link href="#" style={{ color: '#64748b', fontSize: 'clamp(14px, 2vw, 16px)' }}>Partners</Link>
            </Space>
          </Col>
        </Row>

        <div style={{ marginTop: 'clamp(40px, 8vw, 80px)', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}>© {new Date().getFullYear()} HRMS Inc. All rights reserved.</Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
