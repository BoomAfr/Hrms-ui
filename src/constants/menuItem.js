  
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
  ApartmentOutlined,
  BankOutlined,
  WarningOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  CalculatorOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined,
  ReadOutlined,
  TrophyOutlined,
  NotificationOutlined,
  
} from '@ant-design/icons';
  export const menuItems = [
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
    icon: <TeamOutlined />,
    label: 'Employee Management',
    children: [
      {
        key: '/employee-management/department',
        icon: <ApartmentOutlined />,
        label: 'Department',
      },
      {
        key: '/employee-management/designation',
        icon: <UserOutlined />,
        label: 'Designation',
      },
      {
        key: '/employee-management/branch',
        icon: <BankOutlined />,
        label: 'Branch',
      },
      {
        key: '/employee-management/manage-employee',
        icon: <TeamOutlined />,
        label: 'Manage Employee',
      },
      {
        key: '/employee-management/warning',
        icon: <WarningOutlined />,
        label: 'Warning',
      },
      {
        key: '/employee-management/termination',
        icon: <UserOutlined />,
        label: 'Termination',
      },
      {
        key: '/employee-management/promotion',
        icon: <RiseOutlined />,
        label: 'Promotion',
      },
      {
        key: '/employee-management/employee-permanent',
        icon: <CheckCircleOutlined />,
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
            icon: <FileTextOutlined />,
            label: 'Leave Type',
          },
          {
            key: '/leave-management/setup/earn-leave-configure',
            icon: <CalculatorOutlined />,
            label: 'Earn Leave Configure',
          },
        ],
      },
      {
        key: '/leave-management/leave-application',
        icon: <ProfileOutlined />,
        label: 'Leave Application',
        children: [
          {
            key: '/leave-management/leave-application/apply-for-leave',
            icon: <PlusOutlined />,
            label: 'Apply for Leave',
          },
          {
            key: '/leave-management/leave-application/requested-application',
            icon: <ScheduleOutlined />,
            label: 'Requested Application',
          },
        ],
      },
      {
        key: '/leave-management/report',
        icon: <BarChartOutlined />,
        label: 'Report',
        children: [
          {
            key: '/leave-management/report/leave-report',
            icon: <FileTextOutlined />,
            label: 'Leave Report',
          },
          {
            key: '/leave-management/report/summary-report',
            icon: <BarChartOutlined />,
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
            icon: <ScheduleOutlined />,
            label: 'Monthly Attendance',
          },
          {
            key: '/attendance/report/my-attendance-report',
            icon: <FileTextOutlined />,
            label: 'My Attendance Report',
          },
          {
            key: '/attendance/report/summary-report',
            icon: <BarChartOutlined />,
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
    key: '/performance',
    icon: <BarChartOutlined />,
    label: 'Performance',
    children: [
      { 
        key: '/performance-category', 
        icon: <ApartmentOutlined />,
        label: 'Performance Category' 
      },
      { 
        key: '/performance-criteria', 
        icon: <SafetyCertificateOutlined />,
        label: 'Performance Criteria' 
      },
      { 
        key: '/employee-performance', 
        icon: <UserOutlined />,
        label: 'Employee Performance' 
      },
      {
        key: '/performance-report',
        icon: <FileTextOutlined />,
        label: 'Report',
        children: [
          { 
            key: '/performance-summary-report', 
            icon: <BarChartOutlined />,
            label: 'Summary Report' 
          },
        ],
      },
    ],
  },
  {
    key: '/recruitment',
    icon: <UserAddOutlined />,
    label: 'Recruitment',
    children: [
      { 
        key: '/job-post', 
        icon: <FileTextOutlined />,
        label: 'Job Post' 
      },
      { 
        key: '/job-candidate', 
        icon: <UserOutlined />,
        label: 'Job Candidate' 
      },
    ],
  },
  {
    key: '/training',
    icon: <ReadOutlined />,
    label: 'Training',
    children: [
      { 
        key: '/training-type', 
        icon: <ApartmentOutlined />,
        label: 'Training Type' 
      },
      { 
        key: '/training-list', 
        icon: <CalendarOutlined />,
        label: 'Training List' 
      },
      { 
        key: '/training-report', 
        icon: <BarChartOutlined />,
        label: 'Training Report' 
      },
    ],
  },
  {
    key: '/award',
    icon: <TrophyOutlined />,
    label: 'Award',
    children: [
      { 
        key: '/award', 
        icon: <GiftOutlined />,
        label: 'Award' 
      },
    ],
  },
  {
    key: '/notice-board',
    icon: <NotificationOutlined />,
    label: 'Notice Board',
    children: [
      { 
        key: '/notice', 
        icon: <FileTextOutlined />,
        label: 'Notice' 
      },
    ],
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    children: [
      { 
        key: '/settings', 
        icon: <SettingOutlined />,
        label: 'Settings' 
      },
    ],
  },
];
