import React from 'react';
import { Typography, Card, Row, Col, Button, Tag, Spin, Empty, Alert } from 'antd';
import { CheckCircleFilled, ArrowRightOutlined, CrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePlans } from '../../hooks/usePlans';

const { Title, Paragraph, Text } = Typography;


const Pricing = () => {
  const navigate = useNavigate();
  const { plans, loading, error } = usePlans();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handlePlanSelect = (plan) => {
    localStorage.setItem('selected_plan_id', plan.id);
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/signup');
    }
  };

  const getPlanColor = (planName) => {
    const colors = {
      Free: '#52c41a',
      Basic: '#1677ff',
      Premium: '#722ed1',
      Enterprise: '#fa8c16',
    };
    return colors[planName] || '#1677ff';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)' }}>
      {/* Header */}
      <div style={{ padding: 'clamp(60px, 10vw, 100px) 24px clamp(40px, 6vw, 60px)', textAlign: 'center' }}>
        <Title level={1} style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '16px' }}>
          Choose the <span className="gradient-text">Perfect Plan</span> for Your Team
        </Title>
        <Paragraph style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
          Transparent pricing with no hidden fees. Start free and scale as you grow.
        </Paragraph>
      </div>

      {/* Pricing Cards */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" tip="Loading our pricing plans..." />
          </div>
        ) : error ? (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Alert
              message="Failed to load pricing"
              description={error}
              type="error"
              showIcon
              action={
                <Button size="small" danger onClick={() => window.location.reload()}>
                  Retry
                </Button>
              }
            />
          </div>
        ) : plans.length === 0 ? (
          <Empty description="No pricing plans available at the moment." />
        ) : (
          <Row gutter={[24, 24]} justify="center">
            {plans.map((plan) => (
              <Col xs={24} sm={12} lg={6} key={plan.id}>
                <Card
                  className="pricing-card"
                  style={{
                    height: '100%',
                    borderRadius: '24px',
                    border: plan.popular ? `2px solid ${getPlanColor(plan.plan_name)}` : '1px solid #f0f0f0',
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  }}
                  bodyStyle={{ padding: 'clamp(24px, 4vw, 32px)' }}
                >
                  {plan.plan_name === 'Premium' && (
                    <Tag
                      icon={<CrownOutlined />}
                      color={getPlanColor(plan.plan_name)}
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '20px',
                        fontSize: '14px',
                        padding: '4px 12px',
                        fontWeight: 600,
                      }}
                    >
                      MOST POPULAR
                    </Tag>
                  )}

                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        background: `linear-gradient(135deg, ${getPlanColor(plan.plan_name)}20 0%, ${getPlanColor(plan.plan_name)}40 100%)`,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        fontSize: '32px',
                      }}
                    >
                      {plan.plan_name === 'Free' && '🎁'}
                      {plan.plan_name === 'Basic' && '🚀'}
                      {plan.plan_name === 'Premium' && '⭐'}
                      {plan.plan_name === 'Enterprise' && '👑'}
                    </div>
                    <Title level={3} style={{ marginBottom: '8px', fontSize: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                      {plan.plan_name}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
                      {plan.description}
                    </Text>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                      <Text style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 700, color: getPlanColor(plan.plan_name) }}>
                        ₹{parseFloat(plan.price).toLocaleString()}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
                        /{plan.billing_cycle === 'YEARLY' ? 'year' : 'month'}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}>
                      {plan.is_unlimited_employees ? 'Unlimited employees' : `Up to ${plan.max_employees} employees`}
                    </Text>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <CheckCircleFilled style={{ color: getPlanColor(plan.plan_name), fontSize: '18px', marginTop: '2px' }} />
                      <Text style={{ fontSize: 'clamp(14px, 2vw, 15px)', flex: 1 }}>
                        {plan.features_count} Premium Features Included
                      </Text>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <CheckCircleFilled style={{ color: getPlanColor(plan.plan_name), fontSize: '18px', marginTop: '2px' }} />
                      <Text style={{ fontSize: 'clamp(14px, 2vw, 15px)', flex: 1 }}>
                        Customizable Workspace
                      </Text>
                    </div>
                  </div>

                  <Button
                    type={plan.popular ? 'primary' : 'default'}
                    size="large"
                    block
                    icon={<ArrowRightOutlined />}
                    style={{
                      height: '48px',
                      borderRadius: '12px',
                      fontSize: 'clamp(14px, 2vw, 16px)',
                      fontWeight: 600,
                      background: plan.popular ? getPlanColor(plan.plan_name) : undefined,
                      borderColor: plan.popular ? getPlanColor(plan.plan_name) : undefined,
                    }}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {parseFloat(plan.price) === 0 ? 'Start Free' : 'Get Started'}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}


        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Title level={3} style={{ marginBottom: '16px' }}>Need a custom plan?</Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '24px' }}>
            Contact our sales team for enterprise solutions tailored to your needs.
          </Paragraph>
          <Button type="primary" size="large" style={{ height: '56px', padding: '0 40px', fontSize: '18px', borderRadius: '12px' }}>
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
