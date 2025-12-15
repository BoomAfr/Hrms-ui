import React from 'react';
import { Typography, Button, Card } from 'antd';
import { MailOutlined, FormOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Support = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)' }}>
      {/* Header */}
      <div style={{ padding: 'clamp(60px, 10vw, 100px) 24px clamp(40px, 6vw, 60px)', textAlign: 'center' }}>
        <Title level={1} style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '16px' }}>
          We're Here to <span className="gradient-text">Help</span>
        </Title>
        <Paragraph style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
          Have a question or need assistance? Reach out to us via email or submit your query through our form.
        </Paragraph>
      </div>

      {/* Contact Section */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Email Card */}
        <Card
          className="glass-panel"
          style={{
            borderRadius: '24px',
            border: 'none',
            marginBottom: '48px',
            textAlign: 'center',
          }}
          bodyStyle={{ padding: 'clamp(40px, 6vw, 60px)' }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <MailOutlined style={{ fontSize: '40px', color: 'white' }} />
          </div>
          <Title level={2} style={{ marginBottom: '16px', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
            Email Us
          </Title>
          <Paragraph style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#64748b', marginBottom: '24px' }}>
            Send us an email and we'll get back to you within 24 hours.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<MailOutlined />}
            href="mailto:support@hrms.com"
            style={{
              height: '56px',
              padding: '0 40px',
              fontSize: 'clamp(16px, 2vw, 18px)',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
              border: 'none',
            }}
          >
            support@hrms.com
          </Button>
        </Card>

        {/* Google Form Section */}
        <Card
          className="glass-panel"
          style={{
            borderRadius: '24px',
            border: 'none',
          }}
          bodyStyle={{ padding: 'clamp(32px, 5vw, 48px)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #52c41a 0%, #1677ff 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <FormOutlined style={{ fontSize: '40px', color: 'white' }} />
            </div>
            <Title level={2} style={{ marginBottom: '16px', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
              Submit a Support Request
            </Title>
            <Paragraph style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#64748b', marginBottom: '32px' }}>
              Fill out our form to describe your issue and we'll assist you as soon as possible.
            </Paragraph>
          </div>

          {/* Embedded Google Form */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSex3U4-Qj86nfahIn70Cg3lMUqw3j8p51vMmDUPdP6x2Pl8SQ/viewform?embedded=true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Support Form"
            >
              Loading…
            </iframe>
          </div>

          {/* Alternative link for mobile */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button
              type="link"
              href="https://docs.google.com/forms/d/e/1FAIpQLSex3U4-Qj86nfahIn70Cg3lMUqw3j8p51vMmDUPdP6x2Pl8SQ/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}
            >
              Open form in new window →
            </Button>
          </div>
        </Card>

        {/* Additional Info */}
        <div style={{ textAlign: 'center', marginTop: '48px', padding: '32px', background: '#f8fafc', borderRadius: '16px' }}>
          <Paragraph style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#64748b', marginBottom: 0 }}>
            💡 <strong>Tip:</strong> For faster response, please provide as much detail as possible about your issue.
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default Support;
