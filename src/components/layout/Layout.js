import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Grid,
  Breadcrumb,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,  
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { menuItems } from '../../constants/menuItem';
import BackButton from '../common/BackButton/BackButton';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const { user } = useSelector((state) => state.auth);


  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];
  const getBreadcrumbItems = (pathname, menuItems) => {
  const items = [
    {
      title: <HomeOutlined />,
      href: '/'
    }
  ];
  const findPath = (menuArray, path) => {
    for (const item of menuArray) {
      if (item.key === path) {
        return [item];
      }
      if (item.children) {
        const found = findPath(item.children, path);
        if (found.length > 0) {
          return [item, ...found];
        }
      }
    }
    return [];
  };
  const pathItems = findPath(menuItems, pathname);
  
  pathItems.forEach(item => {
    items.push({
      title: (
        <Space>
          {item.icon}
          <span>{item.label}</span>
        </Space>
      )
    });
  });

  return items;
  
};
 const breadcrumbItems = getBreadcrumbItems(location.pathname, menuItems);

 const breadcrumb = (
    <Header
      style={{
        padding: '0 16px',
        background: '#f5f5f5',
        borderBottom: '1px solid #d9d9d9',

      }}
    >
      <Breadcrumb
        items={breadcrumbItems}
        style={{ 
          margin: '16px 0',
          fontSize: '18px',
          fontWeight:"600",
          color:"rgba(0, 0, 0, 0.88);"
        }}
      />
     {location.pathname !== '/' && <BackButton/>}
    </Header>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={screens.lg ? 80 : 0}
        width={250}
      >
         <div 
      style={{ 
        padding: collapsed ? '16px 8px' : '16px', 
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {collapsed ? (
        <Avatar 
          size="large" 
          icon={<UserOutlined />}
          style={{ backgroundColor: '#87d068' }}
        />
      ) : (
        <div>
          <Avatar 
            size={64} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: '#87d068',
              marginBottom: '12px'
            }}
          />
          <div style={{ color: 'white' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {user?.role || 'Administrator'}
            </div>
          </div>
        </div>
      )}
    </div>
        <div className="logo">
          {collapsed ? 'HR' : 'HRMS'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px #f0f1f2',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name || 'Admin'}</span>
            </Space>
          </Dropdown>
        </Header>
          {breadcrumb}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;