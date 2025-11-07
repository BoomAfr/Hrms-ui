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
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  UnlockOutlined,
  KeyOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  EditOutlined,
  MinusOutlined,
  CheckOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/administration',
      icon: <SettingOutlined />,
      label: 'Administration',
      children: [
        {
          key: '/administration/manage-role',
          icon: <TeamOutlined />,
          label: 'Manage Role',
          children: [
            {
              key: '/administration/manage-role/add-role',
              icon: <PlusOutlined />,
              label: 'Add Role',
            },
            {
              key: '/administration/manage-role/add-role-permission',
              icon: <UnlockOutlined />,
              label: 'Add Role Permission',
            },
          ],
        },
        {
          key: '/administration/change-password',
          icon: <KeyOutlined />,
          label: 'Change Password',
        },
      ],
    },
    {
      key: '/employee-management',
      icon: <UserOutlined />,
      label: 'Employee Management',
      children: [
        {
          key: '/employee-management/department',
          icon: <TeamOutlined />,
          label: 'Department',
        },
        {
          key: '/employee-management/designation',
          icon: <UserOutlined />,
          label: 'Designation',
        },
        {
          key: '/employee-management/branch',
          icon: <UserOutlined />,
          label: 'Branch',
        },
        {
          key: '/employee-management/manage-employee',
          icon: <UserOutlined />,
          label: 'Manage Employee',
        },
        {
          key: '/employee-management/warning',
          icon: <UserOutlined />,
          label: 'Warning',
        },
        {
          key: '/employee-management/termination',
          icon: <UserOutlined />,
          label: 'Termination',
        },
        {
          key: '/employee-management/promotion',
          icon: <UserOutlined />,
          label: 'Promotion',
        },
        {
          key: '/employee-management/employee-permanent',
          icon: <UserOutlined />,
          label: 'Employee Permanent',
        },
      ],
    },
        {
      key: '/leave-management',
      icon: <CalendarOutlined />,
      label: 'Leave Management',
      children: [
        {
          key: '/leave-management/setup',
          icon: <SettingOutlined />,
          label: 'Setup',
          children: [
            {
              key: '/leave-management/setup/manage-holiday',
              icon: <CalendarOutlined />,
              label: 'Manage Holiday',
            },
            {
              key: '/leave-management/setup/public-holiday',
              icon: <CalendarOutlined />,
              label: 'Public Holiday',
            },
            {
              key: '/leave-management/setup/weekly-holiday',
              icon: <CalendarOutlined />,
              label: 'Weekly Holiday',
            },
            {
              key: '/leave-management/setup/leave-type',
              icon: <CalendarOutlined />,
              label: 'Leave Type',
            },
            {
              key: '/leave-management/setup/earn-leave-configure',
              icon: <CalendarOutlined />,
              label: 'Earn Leave Configure',
            },
          ],
        },
        {
          key: '/leave-management/leave-application',
          icon: <UserOutlined />,
          label: 'Leave Application',
          children: [
            {
              key: '/leave-management/leave-application/apply-for-leave',
              icon: <PlusOutlined />,
              label: 'Apply for Leave',
            },
            {
              key: '/leave-management/leave-application/requested-application',
              icon: <UserOutlined />,
              label: 'Requested Application',
            },
          ],
        },
        {
          key: '/leave-management/report',
          icon: <DollarOutlined />,
          label: 'Report',
          children: [
            {
              key: '/leave-management/report/leave-report',
              icon: <UserOutlined />,
              label: 'Leave Report',
            },
            {
              key: '/leave-management/report/summary-report',
              icon: <UserOutlined />,
              label: 'Summary Report',
            },
            {
              key: '/leave-management/report/my-leave-report',
              icon: <UserOutlined />,
              label: 'My Leave Report',
            },
          ],
        },
      ],
    },
{
    key: '/attendance',
    icon: <ClockCircleOutlined />,
    label: 'Attendance',
    children: [
      {
        key: '/attendance/setup',
        icon: <SettingOutlined />,
        label: 'Setup',
        children: [
          {
            key: '/attendance/setup/manage-work-shift',
            icon: <ClockCircleOutlined />,
            label: 'Manage Work Shift',
          },
          {
            key: '/attendance/setup/dashboard-attendance',
            icon: <DashboardOutlined />,
            label: 'Dashboard Attendance',
          },
        ],
      },
      {
        key: '/attendance/report',
        icon: <BarChartOutlined />,
        label: 'Report',
        children: [
          {
            key: '/attendance/report/daily-attendance',
            icon: <CalendarOutlined />,
            label: 'Daily Attendance',
          },
          {
            key: '/attendance/report/monthly-attendance',
            icon: <CalendarOutlined />,
            label: 'Monthly Attendance',
          },
          {
            key: '/attendance/report/my-attendance-report',
            icon: <FileTextOutlined />,
            label: 'My Attendance Report',
          },
          {
            key: '/attendance/report/summary-report',
            icon: <FileTextOutlined />,
            label: 'Summary Report',
          },
        ],
      },
      {
        key: '/attendance/manual-attendance',
        icon: <EditOutlined />,
        label: 'Manual Attendance',
      },
    ],
  },
{
    key: '/payroll',
    icon: <DollarOutlined />,
    label: 'Payroll',
    children: [
      {
        key: '/payroll/setup',
        icon: <SettingOutlined />,
        label: 'Setup',
        children: [
          {
            key: '/payroll/setup/tax-rule-setup',
            icon: <FileTextOutlined />,
            label: 'Tax Rule Setup',
          },
          {
            key: '/payroll/setup/late-configuration',
            icon: <ClockCircleOutlined />,
            label: 'Late Configuration',
          },
        ],
      },
      {
        key: '/payroll/allowance',
        icon: <PlusOutlined />,
        label: 'Allowance',
      },
      {
        key: '/payroll/deduction',
        icon: <MinusOutlined />,
        label: 'Deduction',
      },
      {
        key: '/payroll/monthly-pay-grade',
        icon: <DollarOutlined />,
        label: 'Monthly Pay Grade',
      },
      {
        key: '/payroll/hourly-pay-grade',
        icon: <ClockCircleOutlined />,
        label: 'Hourly Pay Grade',
      },
      {
        key: '/payroll/generate-salary-sheet',
        icon: <FileTextOutlined />,
        label: 'Generate Salary Sheet',
      },
      {
        key: '/payroll/report',
        icon: <BarChartOutlined />,
        label: 'Report',
        children: [
          {
            key: '/payroll/report/payment-history',
            icon: <FileTextOutlined />,
            label: 'Payment History',
          },
          {
            key: '/payroll/report/my-payroll',
            icon: <UserOutlined />,
            label: 'My Payroll',
          },
        ],
      },
      {
        key: '/payroll/manage-work-hour',
        icon: <ClockCircleOutlined />,
        label: 'Manage Work Hour',
        children: [
          {
            key: '/payroll/manage-work-hour/approve-work-hour',
            icon: <CheckOutlined />,
            label: 'Approve Work Hour',
          },
        ],
      },
      {
        key: '/payroll/manage-bonus',
        icon: <GiftOutlined />,
        label: 'Manage Bonus',
        children: [
          {
            key: '/payroll/manage-bonus/bonus-setting',
            icon: <SettingOutlined />,
            label: 'Bonus Setting',
          },
          {
            key: '/payroll/manage-bonus/generate-bonus',
            icon: <PlusOutlined />,
            label: 'Generate Bonus',
          },
        ],
      },
    ],
  },
  {
  key: 'performance',
  icon: <DashboardOutlined />,
  label: 'Performance',
  children: [
    { key: '/performance-category', label: 'Performance Category' },
    { key: '/performance', label: 'Performance' },
    { key: '/criteria', label: 'Criteria' },
    { key: '/employee-performance', label: 'Employee Performance' },
    {
      key: 'performance-report',
      label: 'Report',
      children: [
        { key: '/performance-summary-report', label: 'Summary Report' },
      ],
    },
  ],
},
{
  key: 'recruitment',
  icon: <TeamOutlined />,
  label: 'Recruitment',
  children: [
    { key: '/job-post', label: 'Job Post', },
    { key: '/job-candidate', label: 'Job Candidate', },
  ],
},
{
  key: 'training',
  icon: <CalendarOutlined />,
  label: 'Training',
  children: [
    { key: '/training-type', label: 'Training Type',icon: <DashboardOutlined /> },
    { key: '/training-list', label: 'Training List',icon: <CalendarOutlined /> },
    { key: '/training-report', label: 'Training Report',icon: <BarChartOutlined /> },
  ],
},
{
  key: 'award',
  icon: <DollarOutlined />,
  label: 'Award',
  children: [
    { key: '/award', label: 'Award',icon: <GiftOutlined /> },
  ],
},
{
  key: 'notice-board',
  icon: <DashboardOutlined />,
  label: 'Notice Board',
  children: [
    { key: '/notice', label: 'Notice',icon: <FileTextOutlined /> },
  ],
},
{
  key: 'settings',
  icon: <SettingOutlined />,
  label: 'Settings',
  children: [
    { key: '/settings', label: 'Settings' },
  ],
},
];

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