import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/landing/logo1.png';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { key: 'home', label: 'Home' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'support', label: 'Support' },
    { key: 'requirements', label: 'Job Requirements' },
  ];

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        height: '72px',
      }}
    >
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="HRMS Logo" style={{ height: '40px' }} />
      </div>

      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Menu
          mode="horizontal"
          items={menuItems}
          onClick={({ key }) => {
            if (key === 'home') navigate('/');
            if (key === 'pricing') navigate('/pricing');
            if (key === 'support') navigate('/support');
            if (key === 'requirements') navigate('/job-requirements');
          }}
          style={{
            borderBottom: 'none',
            minWidth: '500px',
            flex: 1,
            background: 'transparent',
            fontSize: '16px',
          }}
          overflowedIndicator={null}
        />
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="text" onClick={() => navigate('/login')}>Sign In</Button>
          <Button type="primary">Demo Account</Button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        className="mobile-menu-btn"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setMobileMenuOpen(true)}
        style={{ display: 'none' }}
      />

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          onClick={({ key }) => {
            if (key === 'home') navigate('/');
            if (key === 'pricing') navigate('/pricing');
            if (key === 'support') navigate('/support');
            if (key === 'requirements') navigate('/job-requirements');
            setMobileMenuOpen(false);
          }}
          style={{ borderRight: 'none' }}
        />
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button block onClick={() => navigate('/login')}>Sign In</Button>
          <Button type="primary" block>Book a Demo</Button>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
