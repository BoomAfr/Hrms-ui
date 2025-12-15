import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, Divider, Space } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';

const { Title, Text, Paragraph } = Typography;

const SignIn = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    console.log('Sign in values:', values);
    setTimeout(() => {
      setLoading(false);
      alert('Sign in successful! (Demo mode - no backend connected)');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        top: '-200px',
        left: '-200px',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        bottom: '-150px',
        right: '-150px',
        animation: 'float 6s ease-in-out infinite reverse'
      }} />

      {/* Left side - Branding (Hidden on mobile/tablet) */}
      <div className="signin-branding" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '500px' }}>
          <img src={logo} alt="HRMS Logo" style={{ height: '60px', marginBottom: '32px' }} />
          <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: '24px' }}>
            Welcome Back!
          </Title>
          <Paragraph style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8 }}>
            Sign in to access your HR dashboard and manage your team with confidence.
          </Paragraph>
          <div style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>✓</div>
              <Text style={{ color: 'white', fontSize: '16px' }}>Secure & Encrypted</Text>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>✓</div>
              <Text style={{ color: 'white', fontSize: '16px' }}>24/7 Access</Text>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>✓</div>
              <Text style={{ color: 'white', fontSize: '16px' }}>Multi-device Support</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign in form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 1,
        minWidth: 0
      }}>
        <div className="glass-panel signin-form-container" style={{
          width: '100%',
          maxWidth: '480px',
          padding: '32px',
          borderRadius: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Mobile logo - only visible on mobile */}
          <div className="mobile-logo" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src={logo} alt="HRMS Logo" style={{ height: '50px' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ marginBottom: '8px', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Sign In</Title>
            <Text type="secondary" style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
              Enter your credentials to access your account
            </Text>
          </div>

          {/* Social login buttons */}
          <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '24px' }}>
            <Button
              size="large"
              block
              icon={<GoogleOutlined />}
              style={{ height: '48px', borderRadius: '12px', fontSize: 'clamp(14px, 2vw, 16px)' }}
            >
              Continue with Google
            </Button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                size="large"
                icon={<GithubOutlined />}
                style={{ flex: 1, height: '48px', borderRadius: '12px', fontSize: 'clamp(14px, 2vw, 16px)' }}
              >
                GitHub
              </Button>
              <Button
                size="large"
                icon={<LinkedinOutlined />}
                style={{ flex: 1, height: '48px', borderRadius: '12px', fontSize: 'clamp(14px, 2vw, 16px)' }}
              >
                LinkedIn
              </Button>
            </div>
          </Space>

          <Divider style={{ margin: '24px 0' }}>
            <Text type="secondary" style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}>Or continue with email</Text>
          </Divider>

          <Form
            name="signin"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label={<span style={{ fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 500 }}>Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                placeholder="you@example.com"
                style={{ height: '48px', borderRadius: '12px', fontSize: 'clamp(14px, 2vw, 16px)' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 500 }}>Password</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                placeholder="Enter your password"
                style={{ height: '48px', borderRadius: '12px', fontSize: 'clamp(14px, 2vw, 16px)' }}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: '#1677ff', fontWeight: 500, fontSize: 'clamp(12px, 2vw, 14px)' }}>
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: '56px',
                  borderRadius: '12px',
                  fontSize: 'clamp(16px, 2vw, 18px)',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text type="secondary" style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#1677ff', fontWeight: 600 }}>
                Sign up for free
              </Link>
            </Text>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/" style={{ color: '#64748b', fontSize: 'clamp(12px, 2vw, 14px)' }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
