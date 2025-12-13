import { useState, useMemo } from 'react';
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
  Spin,
  Drawer
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
import BackButton from '../common/BackButton/BackButton';
import { useToast } from '../../hooks/useToast';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { getIconComponent } from '../../constants/menuItem';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
const transformToMenuItems = (data) => {
  return data.map(item => {
    const menuItem = {
      key: item.key || item.id?.toString(),
      icon: getIconComponent(item.icon),
      label: item.label,
    };

    if (item.children && item.children.length > 0) {
      menuItem.children = transformToMenuItems(item.children);
    }

    return menuItem;
  });
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const { Toast, contextHolder } = useToast();

  const user = useSelector((state) => state.user);
  const profile = user?.profile?.profile;
  const role = user?.profile?.role;

  const formatRole = (role) => {
    if (!role) return 'Employee';

    if (typeof role === 'object' && role !== null) {
      return role.name || 'Employee';
    }

    const roleString = String(role);
    return roleString.charAt(0).toUpperCase() + roleString.slice(1).toLowerCase();
  };

  const getUserPages = () => {
    if (role?.pages && Array.isArray(role.pages)) {
      return role.pages;
    }
    return [];
  };
  const sidebarMenuItems = useMemo(() => {
    const userPages = getUserPages();
    const data = userPages.length > 0 ? userPages : [];

    return transformToMenuItems(data);
  }, [role]);

  const handleMenuClick = ({ key }) => {
    navigate(key);
    // Close drawer on mobile when menu item is clicked
    if (!screens.lg) {
      setCollapsed(true);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      Toast.success("Logout Successfully");
    } catch (error) {
      Toast.error("Something went wrong");
    } finally {
      setTimeout(() => {
        navigate('/login');
      }, 300);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        const userId = user?.profile?.user_id || user?.profile?.profile?.user_id || user?.profile?.id;
        navigate(`/employee-management/manage-employee/profile/${userId}`);
      },
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const breadcrumbItems = location.pathname.split('/').filter(i => i).map((i, index, arr) => ({
    title: i.charAt(0).toUpperCase() + i.slice(1),
    key: i,
    href: index === arr.length - 1 ? null : `/${arr.slice(0, index + 1).join('/')}`,
  }));

  const breadcrumb = (
    <div
      style={{
        padding: '16px 16px 0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Breadcrumb
        items={[
          { title: <HomeOutlined />, href: '/' },
          ...breadcrumbItems
        ]}
      />
      {location.pathname !== '/' && <BackButton />}
    </div>
  );

  const getFullName = () => {
    return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';
  };

  const formattedRole = formatRole(role);
  const displayName = getFullName() || 'User';

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // Sidebar content to be reused in both Sider (Desktop) and Drawer (Mobile)
  const SidebarContent = (
    <>
      <div
        style={{
          padding: collapsed && screens.lg ? '16px 8px' : '16px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {collapsed && screens.lg ? (
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
                {displayName}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                {formattedRole}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="logo" style={{
        padding: '16px',
        color: 'white',
        textAlign: 'center',
        fontSize: collapsed && screens.lg ? '16px' : '20px',
        fontWeight: 'bold'
      }}>
        {collapsed && screens.lg ? 'HR' : 'HRMS'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={sidebarMenuItems}
        onClick={handleMenuClick}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}

      {/* Mobile Drawer */}
      {!screens.lg && (
        <Drawer
          placement="left"
          onClose={() => setCollapsed(true)}
          open={!collapsed}
          width={250}
          styles={{ body: { padding: 0, backgroundColor: '#001529' } }}
          closable={false}
          maskClosable={true}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* Desktop Sider */}
      {screens.lg && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={80}
          width={250}
        >
          {SidebarContent}
        </Sider>
      )}

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
              <span>{displayName}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                ({formattedRole})
              </span>
            </Space>
          </Dropdown>
        </Header>
        {breadcrumb}
        <Content
          style={{
            margin: screens.lg ? '24px 16px' : '12px 8px',
            padding: screens.lg ? 24 : 12,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;