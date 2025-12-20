import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Space, Divider, Tag } from 'antd';
import { CheckCircleFilled, CrownOutlined } from '@ant-design/icons';
import { usePlans } from '../../hooks/usePlans';

const { Title, Text, Paragraph } = Typography;

const PlanPurchasePopup = ({ planId, onClose }) => {
  const [visible, setVisible] = useState(false);
  const { plans, loading } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (planId && plans.length > 0) {
      const plan = plans.find(p => p.id.toString() === planId.toString());
      if (plan) {
        if (plan.plan_name === 'Free') {
          localStorage.removeItem('selected_plan_id');
          return;
        }
        setSelectedPlan(plan);
        setVisible(true);
      }
    }
  }, [planId, plans]);

  const handleClose = () => {
    setVisible(false);
    localStorage.removeItem('selected_plan_id');
    onClose();
  };

  const handlePay = () => {
    // This is where payment integration would go
    console.log(`Processing payment for plan: ${selectedPlan?.plan_name}`);
    handleClose();
  };

  if (!selectedPlan) return null;

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={400}
      centered
      destroyOnClose
      maskStyle={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      bodyStyle={{ padding: '32px' }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #6f53e120 0%, #6f53e140 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px',
          }}
        >
          {selectedPlan.plan_name === 'Free' && '🎁'}
          {selectedPlan.plan_name === 'Basic' && '🚀'}
          {selectedPlan.plan_name === 'Premium' && '⭐'}
          {selectedPlan.plan_name === 'Enterprise' && '👑'}
        </div>

        <Tag color="#722ed1" icon={<CrownOutlined />} style={{ marginBottom: '16px' }}>
          Selected Plan
        </Tag>

        <Title level={2} style={{ margin: 0 }}>
          {selectedPlan.plan_name}
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: '24px' }}>
          {selectedPlan.description}
        </Paragraph>

        <div style={{ backgroundColor: '#f8f9ff', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#1677ff' }}>
              ₹{parseFloat(selectedPlan.price).toLocaleString()}
            </span>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              /{selectedPlan.billing_cycle === 'YEARLY' ? 'year' : 'month'}
            </Text>
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <div style={{ textAlign: 'left' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircleFilled style={{ color: '#52c41a', marginTop: '4px' }} />
                <Text>{selectedPlan.is_unlimited_employees ? 'Unlimited employees' : `Up to ${selectedPlan.max_employees} employees`}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircleFilled style={{ color: '#52c41a', marginTop: '4px' }} />
                <Text>{selectedPlan.features_count} Premium Features</Text>
              </div>
            </Space>
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          block
          onClick={handlePay}
          style={{
            height: '54px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 600,
            background: '#6f53e1',
            borderColor: '#6f53e1',
            boxShadow: '0 4px 14px 0 rgba(111, 83, 225, 0.39)',
          }}
          loading={loading}
        >
          Pay & Activate Now
        </Button>
        <Button
          type="link"
          onClick={handleClose}
          style={{ marginTop: '12px', color: '#64748b' }}
        >
          I'll do it later
        </Button>
      </div>
    </Modal>
  );
};

export default PlanPurchasePopup;
