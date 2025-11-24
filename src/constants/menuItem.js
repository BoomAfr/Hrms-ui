  
//   import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   DashboardOutlined,
//   TeamOutlined,
//   CalendarOutlined,
//   DollarOutlined,
//   LogoutOutlined,
//   UserOutlined,
//   SettingOutlined,
//   PlusOutlined,
//   UnlockOutlined,
//   KeyOutlined,
//   ClockCircleOutlined,
//   BarChartOutlined,
//   FileTextOutlined,
//   EditOutlined,
//   MinusOutlined,
//   CheckOutlined,
//   GiftOutlined,
//   ApartmentOutlined,
//   BankOutlined,
//   WarningOutlined,
//   RiseOutlined,
//   CheckCircleOutlined,
//   CalculatorOutlined,
//   ProfileOutlined,
//   ScheduleOutlined,
//   SafetyCertificateOutlined,
//   UserAddOutlined,
//   ReadOutlined,
//   TrophyOutlined,
//   NotificationOutlined,
  
// } from '@ant-design/icons';
//   export const menuItems = [
//   {
//     key: '/',
//     icon: <DashboardOutlined />,
//     label: 'Dashboard',
//   },
//   {
//     key: '/administration',
//     icon: <SettingOutlined />,
//     label: 'Administration',
//     children: [
//       {
//         key: '/administration/manage-role',
//         icon: <TeamOutlined />,
//         label: 'Manage Role',
//         children: [
//           {
//             key: '/administration/manage-role/add-role',
//             icon: <PlusOutlined />,
//             label: 'Add Role',
//           },
//           {
//             key: '/administration/manage-role/add-role-permission',
//             icon: <UnlockOutlined />,
//             label: 'Add Role Permission',
//           },
//         ],
//       },
//       {
//         key: '/administration/change-password',
//         icon: <KeyOutlined />,
//         label: 'Change Password',
//       },
//     ],
//   },
//   {
//     key: '/EMPLOYEE-management',
//     icon: <TeamOutlined />,
//     label: 'Employee Management',
//     children: [
//       {
//         key: '/EMPLOYEE-management/department',
//         icon: <ApartmentOutlined />,
//         label: 'Department',
//       },
//       {
//         key: '/EMPLOYEE-management/designation',
//         icon: <UserOutlined />,
//         label: 'Designation',
//       },
//       {
//         key: '/EMPLOYEE-management/branch',
//         icon: <BankOutlined />,
//         label: 'Branch',
//       },
//       {
//         key: '/EMPLOYEE-management/manage-EMPLOYEE',
//         icon: <TeamOutlined />,
//         label: 'Manage Employee',
//       },
//       {
//         key: '/EMPLOYEE-management/warning',
//         icon: <WarningOutlined />,
//         label: 'Warning',
//       },
//       {
//         key: '/EMPLOYEE-management/termination',
//         icon: <UserOutlined />,
//         label: 'Termination',
//       },
//       {
//         key: '/EMPLOYEE-management/promotion',
//         icon: <RiseOutlined />,
//         label: 'Promotion',
//       },
//       {
//         key: '/EMPLOYEE-management/EMPLOYEE-permanent',
//         icon: <CheckCircleOutlined />,
//         label: 'Employee Permanent',
//       },
//     ],
//   },
//   {
//     key: '/leave-management',
//     icon: <CalendarOutlined />,
//     label: 'Leave Management',
//     children: [
//       {
//         key: '/leave-management/setup',
//         icon: <SettingOutlined />,
//         label: 'Setup',
//         children: [
//           {
//             key: '/leave-management/setup/manage-holiday',
//             icon: <CalendarOutlined />,
//             label: 'Manage Holiday',
//           },
//           {
//             key: '/leave-management/setup/public-holiday',
//             icon: <CalendarOutlined />,
//             label: 'Public Holiday',
//           },
//           {
//             key: '/leave-management/setup/weekly-holiday',
//             icon: <CalendarOutlined />,
//             label: 'Weekly Holiday',
//           },
//           {
//             key: '/leave-management/setup/leave-type',
//             icon: <FileTextOutlined />,
//             label: 'Leave Type',
//           },
//           {
//             key: '/leave-management/setup/earn-leave-configure',
//             icon: <CalculatorOutlined />,
//             label: 'Earn Leave Configure',
//           },
//         ],
//       },
//       {
//         key: '/leave-management/leave-application',
//         icon: <ProfileOutlined />,
//         label: 'Leave Application',
//         children: [
//           {
//             key: '/leave-management/leave-application/apply-for-leave',
//             icon: <PlusOutlined />,
//             label: 'Apply for Leave',
//           },
//           {
//             key: '/leave-management/leave-application/requested-application',
//             icon: <ScheduleOutlined />,
//             label: 'Requested Application',
//           },
//         ],
//       },
//       {
//         key: '/leave-management/report',
//         icon: <BarChartOutlined />,
//         label: 'Report',
//         children: [
//           {
//             key: '/leave-management/report/leave-report',
//             icon: <FileTextOutlined />,
//             label: 'Leave Report',
//           },
//           {
//             key: '/leave-management/report/summary-report',
//             icon: <BarChartOutlined />,
//             label: 'Summary Report',
//           },
//           {
//             key: '/leave-management/report/my-leave-report',
//             icon: <UserOutlined />,
//             label: 'My Leave Report',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     key: '/attendance',
//     icon: <ClockCircleOutlined />,
//     label: 'Attendance',
//     children: [
//       {
//         key: '/attendance/setup',
//         icon: <SettingOutlined />,
//         label: 'Setup',
//         children: [
//           {
//             key: '/attendance/setup/manage-work-shift',
//             icon: <ClockCircleOutlined />,
//             label: 'Manage Work Shift',
//           },
//           {
//             key: '/attendance/setup/dashboard-attendance',
//             icon: <DashboardOutlined />,
//             label: 'Dashboard Attendance',
//           },
//         ],
//       },
//       {
//         key: '/attendance/report',
//         icon: <BarChartOutlined />,
//         label: 'Report',
//         children: [
//           {
//             key: '/attendance/report/daily-attendance',
//             icon: <CalendarOutlined />,
//             label: 'Daily Attendance',
//           },
//           {
//             key: '/attendance/report/monthly-attendance',
//             icon: <ScheduleOutlined />,
//             label: 'Monthly Attendance',
//           },
//           {
//             key: '/attendance/report/my-attendance-report',
//             icon: <FileTextOutlined />,
//             label: 'My Attendance Report',
//           },
//           {
//             key: '/attendance/report/summary-report',
//             icon: <BarChartOutlined />,
//             label: 'Summary Report',
//           },
//         ],
//       },
//       {
//         key: '/attendance/manual-attendance',
//         icon: <EditOutlined />,
//         label: 'Manual Attendance',
//       },
//     ],
//   },
//   {
//     key: '/payroll',
//     icon: <DollarOutlined />,
//     label: 'Payroll',
//     children: [
//       {
//         key: '/payroll/setup',
//         icon: <SettingOutlined />,
//         label: 'Setup',
//         children: [
//           {
//             key: '/payroll/setup/tax-rule-setup',
//             icon: <FileTextOutlined />,
//             label: 'Tax Rule Setup',
//           },
//           {
//             key: '/payroll/setup/late-configuration',
//             icon: <ClockCircleOutlined />,
//             label: 'Late Configuration',
//           },
//         ],
//       },
//       {
//         key: '/payroll/allowance',
//         icon: <PlusOutlined />,
//         label: 'Allowance',
//       },
//       {
//         key: '/payroll/deduction',
//         icon: <MinusOutlined />,
//         label: 'Deduction',
//       },
//       {
//         key: '/payroll/monthly-pay-grade',
//         icon: <DollarOutlined />,
//         label: 'Monthly Pay Grade',
//       },
//       {
//         key: '/payroll/hourly-pay-grade',
//         icon: <ClockCircleOutlined />,
//         label: 'Hourly Pay Grade',
//       },
//       {
//         key: '/payroll/generate-salary-sheet',
//         icon: <FileTextOutlined />,
//         label: 'Generate Salary Sheet',
//       },
//       {
//         key: '/payroll/report',
//         icon: <BarChartOutlined />,
//         label: 'Report',
//         children: [
//           {
//             key: '/payroll/report/payment-history',
//             icon: <FileTextOutlined />,
//             label: 'Payment History',
//           },
//           {
//             key: '/payroll/report/my-payroll',
//             icon: <UserOutlined />,
//             label: 'My Payroll',
//           },
//         ],
//       },
//       {
//         key: '/payroll/manage-work-hour',
//         icon: <ClockCircleOutlined />,
//         label: 'Manage Work Hour',
//         children: [
//           {
//             key: '/payroll/manage-work-hour/approve-work-hour',
//             icon: <CheckOutlined />,
//             label: 'Approve Work Hour',
//           },
//         ],
//       },
//       {
//         key: '/payroll/manage-bonus',
//         icon: <GiftOutlined />,
//         label: 'Manage Bonus',
//         children: [
//           {
//             key: '/payroll/manage-bonus/bonus-setting',
//             icon: <SettingOutlined />,
//             label: 'Bonus Setting',
//           },
//           {
//             key: '/payroll/manage-bonus/generate-bonus',
//             icon: <PlusOutlined />,
//             label: 'Generate Bonus',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     key: '/performance',
//     icon: <BarChartOutlined />,
//     label: 'Performance',
//     children: [
//       { 
//         key: '/performance-category', 
//         icon: <ApartmentOutlined />,
//         label: 'Performance Category' 
//       },
//       { 
//         key: '/performance-criteria', 
//         icon: <SafetyCertificateOutlined />,
//         label: 'Performance Criteria' 
//       },
//       { 
//         key: '/EMPLOYEE-performance', 
//         icon: <UserOutlined />,
//         label: 'Employee Performance' 
//       },
//       {
//         key: '/performance-report',
//         icon: <FileTextOutlined />,
//         label: 'Report',
//         children: [
//           { 
//             key: '/performance-summary-report', 
//             icon: <BarChartOutlined />,
//             label: 'Summary Report' 
//           },
//         ],
//       },
//     ],
//   },
//   {
//     key: '/recruitment',
//     icon: <UserAddOutlined />,
//     label: 'Recruitment',
//     children: [
//       { 
//         key: '/job-post', 
//         icon: <FileTextOutlined />,
//         label: 'Job Post' 
//       },
//       { 
//         key: '/job-candidate', 
//         icon: <UserOutlined />,
//         label: 'Job Candidate' 
//       },
//     ],
//   },
//   {
//     key: '/training',
//     icon: <ReadOutlined />,
//     label: 'Training',
//     children: [
//       { 
//         key: '/training-type', 
//         icon: <ApartmentOutlined />,
//         label: 'Training Type' 
//       },
//       { 
//         key: '/training-list', 
//         icon: <CalendarOutlined />,
//         label: 'Training List' 
//       },
//       { 
//         key: '/training-report', 
//         icon: <BarChartOutlined />,
//         label: 'Training Report' 
//       },
//     ],
//   },
//   {
//     key: '/award',
//     icon: <TrophyOutlined />,
//     label: 'Award',
//     children: [
//       { 
//         key: '/award', 
//         icon: <GiftOutlined />,
//         label: 'Award' 
//       },
//     ],
//   },
//   {
//     key: '/notice-board',
//     icon: <NotificationOutlined />,
//     label: 'Notice Board',
//     children: [
//       { 
//         key: '/notice', 
//         icon: <FileTextOutlined />,
//         label: 'Notice' 
//       },
//     ],
//   },
//   {
//     key: '/settings',
//     icon: <SettingOutlined />,
//     label: 'Settings',
//     children: [
//       { 
//         key: '/settings', 
//         icon: <SettingOutlined />,
//         label: 'Settings' 
//       },
//     ],
//   },
// ];

// constants/menuItem.js
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
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
import { usePages } from '../hooks/pages/usePages';

// Role-based menu items
export const getMenuItems = (userRole) => {
  const allMenuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
    },
    {
      key: '/administration',
      icon: <SettingOutlined />,
      label: 'Administration',
      roles: ['ADMIN'],
      children: [
        {
          key: '/administration/manage-role',
          icon: <TeamOutlined />,
          label: 'Manage Role',
          roles: ['ADMIN'],
          children: [
            {
              key: '/administration/manage-role/add-role',
              icon: <PlusOutlined />,
              label: 'Add Role',
              roles: ['ADMIN'],
            },
            {
              key: '/administration/manage-role/add-role-permission',
              icon: <UnlockOutlined />,
              label: 'Add Role Permission',
              roles: ['ADMIN'],
            },
          ],
        },
        {
          key: '/administration/change-password',
          icon: <KeyOutlined />,
          label: 'Change Password',
          roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
        },
      ],
    },
    {
      key: '/employee-management',
      icon: <TeamOutlined />,
      label: 'Employee Management',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        {
          key: '/employee-management/department',
          icon: <ApartmentOutlined />,
          label: 'Department',
          roles: ['ADMIN'],
        },
        {
          key: '/employee-management/designation',
          icon: <UserOutlined />,
          label: 'Designation',
          roles: ['ADMIN'],
        },
        {
          key: '/employee-management/branch',
          icon: <BankOutlined />,
          label: 'Branch',
          roles: ['ADMIN'],
        },
        {
          key: '/employee-management/manage-employee',
          icon: <TeamOutlined />,
          label: 'Manage Employee',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          key: '/employee-management/warning',
          icon: <WarningOutlined />,
          label: 'Warning',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          key: '/employee-management/termination',
          icon: <UserOutlined />,
          label: 'Termination',
          roles: ['ADMIN'],
        },
        {
          key: '/employee-management/promotion',
          icon: <RiseOutlined />,
          label: 'Promotion',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          key: '/employee-management/employee-permanent',
          icon: <CheckCircleOutlined />,
          label: 'Employee Permanent',
          roles: ['ADMIN'],
        },
      ],
    },
    {
      key: '/leave-management',
      icon: <CalendarOutlined />,
      label: 'Leave Management',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      children: [
        {
          key: '/leave-management/setup',
          icon: <SettingOutlined />,
          label: 'Setup',
          roles: ['ADMIN'],
          children: [
            {
              key: '/leave-management/setup/manage-holiday',
              icon: <CalendarOutlined />,
              label: 'Manage Holiday',
              roles: ['ADMIN'],
            },
            {
              key: '/leave-management/setup/public-holiday',
              icon: <CalendarOutlined />,
              label: 'Public Holiday',
              roles: ['ADMIN'],
            },
            {
              key: '/leave-management/setup/weekly-holiday',
              icon: <CalendarOutlined />,
              label: 'Weekly Holiday',
              roles: ['ADMIN'],
            },
            {
              key: '/leave-management/setup/leave-type',
              icon: <FileTextOutlined />,
              label: 'Leave Type',
              roles: ['ADMIN'],
            },
            {
              key: '/leave-management/setup/earn-leave-configure',
              icon: <CalculatorOutlined />,
              label: 'Earn Leave Configure',
              roles: ['ADMIN'],
            },
          ],
        },
        {
          key: '/leave-management/leave-application',
          icon: <ProfileOutlined />,
          label: 'Leave Application',
          roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
          children: [
            {
              key: '/leave-management/leave-application/apply-for-leave',
              icon: <PlusOutlined />,
              label: 'Apply for Leave',
              roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
            },
            {
              key: '/leave-management/leave-application/requested-application',
              icon: <ScheduleOutlined />,
              label: 'Requested Application',
              roles: ['ADMIN', 'MANAGER'],
            },
          ],
        },
        {
          key: '/leave-management/report',
          icon: <BarChartOutlined />,
          label: 'Report',
          roles: ['ADMIN', 'MANAGER'],
          children: [
            {
              key: '/leave-management/report/leave-report',
              icon: <FileTextOutlined />,
              label: 'Leave Report',
              roles: ['ADMIN', 'MANAGER'],
            },
            {
              key: '/leave-management/report/summary-report',
              icon: <BarChartOutlined />,
              label: 'Summary Report',
              roles: ['ADMIN', 'MANAGER'],
            },
            {
              key: '/leave-management/report/my-leave-report',
              icon: <UserOutlined />,
              label: 'My Leave Report',
              roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
            },
          ],
        },
      ],
    },
    {
      key: '/attendance',
      icon: <ClockCircleOutlined />,
      label: 'Attendance',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      children: [
        {
          key: '/attendance/setup',
          icon: <SettingOutlined />,
          label: 'Setup',
          roles: ['ADMIN'],
          children: [
            {
              key: '/attendance/setup/manage-work-shift',
              icon: <ClockCircleOutlined />,
              label: 'Manage Work Shift',
              roles: ['ADMIN'],
            },
            {
              key: '/attendance/setup/dashboard-attendance',
              icon: <DashboardOutlined />,
              label: 'Dashboard Attendance',
              roles: ['ADMIN'],
            },
          ],
        },
        {
          key: '/attendance/report',
          icon: <BarChartOutlined />,
          label: 'Report',
          roles: ['ADMIN', 'MANAGER'],
          children: [
            {
              key: '/attendance/report/daily-attendance',
              icon: <CalendarOutlined />,
              label: 'Daily Attendance',
              roles: ['ADMIN', 'MANAGER'],
            },
            {
              key: '/attendance/report/monthly-attendance',
              icon: <ScheduleOutlined />,
              label: 'Monthly Attendance',
              roles: ['ADMIN', 'MANAGER'],
            },
            {
              key: '/attendance/report/my-attendance-report',
              icon: <FileTextOutlined />,
              label: 'My Attendance Report',
              roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
            },
            {
              key: '/attendance/report/summary-report',
              icon: <BarChartOutlined />,
              label: 'Summary Report',
              roles: ['ADMIN', 'MANAGER'],
            },
          ],
        },
        {
          key: '/attendance/manual-attendance',
          icon: <EditOutlined />,
          label: 'Manual Attendance',
          roles: ['ADMIN', 'MANAGER'],
        },
      ],
    },
    {
      key: '/payroll',
      icon: <DollarOutlined />,
      label: 'Payroll',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        {
          key: '/payroll/setup',
          icon: <SettingOutlined />,
          label: 'Setup',
          roles: ['ADMIN'],
          children: [
            {
              key: '/payroll/setup/tax-rule-setup',
              icon: <FileTextOutlined />,
              label: 'Tax Rule Setup',
              roles: ['ADMIN'],
            },
            {
              key: '/payroll/setup/late-configuration',
              icon: <ClockCircleOutlined />,
              label: 'Late Configuration',
              roles: ['ADMIN'],
            },
          ],
        },
        {
          key: '/payroll/allowance',
          icon: <PlusOutlined />,
          label: 'Allowance',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          key: '/payroll/deduction',
          icon: <MinusOutlined />,
          label: 'Deduction',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          key: '/payroll/monthly-pay-grade',
          icon: <DollarOutlined />,
          label: 'Monthly Pay Grade',
          roles: ['ADMIN'],
        },
        {
          key: '/payroll/hourly-pay-grade',
          icon: <ClockCircleOutlined />,
          label: 'Hourly Pay Grade',
          roles: ['ADMIN'],
        },
        {
          key: '/payroll/generate-salary-sheet',
          icon: <FileTextOutlined />,
          label: 'Generate Salary Sheet',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          key: '/payroll/report',
          icon: <BarChartOutlined />,
          label: 'Report',
          roles: ['ADMIN', 'MANAGER'],
          children: [
            {
              key: '/payroll/report/payment-history',
              icon: <FileTextOutlined />,
              label: 'Payment History',
              roles: ['ADMIN', 'MANAGER'],
            },
            {
              key: '/payroll/report/my-payroll',
              icon: <UserOutlined />,
              label: 'My Payroll',
              roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
            },
          ],
        },
        {
          key: '/payroll/manage-work-hour',
          icon: <ClockCircleOutlined />,
          label: 'Manage Work Hour',
          roles: ['ADMIN', 'MANAGER'],
          children: [
            {
              key: '/payroll/manage-work-hour/approve-work-hour',
              icon: <CheckOutlined />,
              label: 'Approve Work Hour',
              roles: ['ADMIN', 'MANAGER'],
            },
          ],
        },
        {
          key: '/payroll/manage-bonus',
          icon: <GiftOutlined />,
          label: 'Manage Bonus',
          roles: ['ADMIN'],
          children: [
            {
              key: '/payroll/manage-bonus/bonus-setting',
              icon: <SettingOutlined />,
              label: 'Bonus Setting',
              roles: ['ADMIN'],
            },
            {
              key: '/payroll/manage-bonus/generate-bonus',
              icon: <PlusOutlined />,
              label: 'Generate Bonus',
              roles: ['ADMIN'],
            },
          ],
        },
      ],
    },
    {
      key: '/performance',
      icon: <BarChartOutlined />,
      label: 'Performance',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { 
          key: '/performance-category', 
          icon: <ApartmentOutlined />,
          label: 'Performance Category',
          roles: ['ADMIN'],
        },
        { 
          key: '/performance-criteria', 
          icon: <SafetyCertificateOutlined />,
          label: 'Performance Criteria',
          roles: ['ADMIN'],
        },
        { 
          key: '/EMPLOYEE-performance', 
          icon: <UserOutlined />,
          label: 'Employee Performance',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          key: '/performance-report',
          icon: <FileTextOutlined />,
          label: 'Report',
          roles: ['ADMIN', 'MANAGER'],
          children: [
            { 
              key: '/performance-summary-report', 
              icon: <BarChartOutlined />,
              label: 'Summary Report',
              roles: ['ADMIN', 'MANAGER'],
            },
          ],
        },
      ],
    },
    {
      key: '/recruitment',
      icon: <UserAddOutlined />,
      label: 'Recruitment',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { 
          key: '/job-post', 
          icon: <FileTextOutlined />,
          label: 'Job Post',
          roles: ['ADMIN', 'MANAGER'],
        },
        { 
          key: '/job-candidate', 
          icon: <UserOutlined />,
          label: 'Job Candidate',
          roles: ['ADMIN', 'MANAGER'],
        },
      ],
    },
    {
      key: '/training',
      icon: <ReadOutlined />,
      label: 'Training',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { 
          key: '/training-type', 
          icon: <ApartmentOutlined />,
          label: 'Training Type',
          roles: ['ADMIN'],
        },
        { 
          key: '/training-list', 
          icon: <CalendarOutlined />,
          label: 'Training List',
          roles: ['ADMIN', 'MANAGER'],
        },
        { 
          key: '/training-report', 
          icon: <BarChartOutlined />,
          label: 'Training Report',
          roles: ['ADMIN', 'MANAGER'],
        },
      ],
    },
    {
      key: '/award',
      icon: <TrophyOutlined />,
      label: 'Award',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { 
          key: '/award', 
          icon: <GiftOutlined />,
          label: 'Award',
          roles: ['ADMIN', 'MANAGER'],
        },
      ],
    },
    {
      key: '/notice-board',
      icon: <NotificationOutlined />,
      label: 'Notice Board',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      children: [
        { 
          key: '/notice', 
          icon: <FileTextOutlined />,
          label: 'Notice',
          roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
        },
      ],
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      roles: ['ADMIN'],
      children: [
        { 
          key: '/settings', 
          icon: <SettingOutlined />,
          label: 'Settings',
          roles: ['ADMIN'],
        },
      ],
    },
  ];

  // Filter menu items based on user role
  const filterMenuByRole = (menuItems, userRole) => {
    return menuItems.filter(item => {
      if (!item.roles || item.roles.includes(userRole)) {
        if (item.children) {
          const filteredChildren = filterMenuByRole(item.children, userRole);
          if (filteredChildren.length > 0) {
            return {
              ...item,
              children: filteredChildren
            };
          }
          return false;
        }
        return true;
      }
      return false;
    });
  };

  return filterMenuByRole(allMenuItems, userRole);
};

export const getIconComponent = (iconName) => {
  const iconMap = {
    SettingOutlined: <SettingOutlined />,
    ClockCircleOutlined: <ClockCircleOutlined />,
    DashboardOutlined: <DashboardOutlined />,
    BarChartOutlined: <BarChartOutlined />,
    CalendarOutlined: <CalendarOutlined />,
    DollarOutlined: <DollarOutlined />,
    TrophyOutlined: <TrophyOutlined />,
    TeamOutlined: <TeamOutlined />,
    NotificationOutlined: <NotificationOutlined />,
    UserAddOutlined: <UserAddOutlined />,
    ReadOutlined: <ReadOutlined />,
    ScheduleOutlined: <ScheduleOutlined />,
    FileTextOutlined: <FileTextOutlined />,
    UserOutlined: <UserOutlined />,
    ApartmentOutlined: <ApartmentOutlined />,
    BankOutlined: <BankOutlined />,
    WarningOutlined: <WarningOutlined />,
    RiseOutlined: <RiseOutlined />,
    CheckCircleOutlined: <CheckCircleOutlined />,
    ProfileOutlined: <ProfileOutlined />,
    CalculatorOutlined: <CalculatorOutlined />,
    PlusOutlined: <PlusOutlined />,
    KeyOutlined: <KeyOutlined />,
    UnlockOutlined: <UnlockOutlined />,
    MinusOutlined: <MinusOutlined />,
    CheckOutlined: <CheckOutlined />,
    GiftOutlined: <GiftOutlined />,
    SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  };
  
  return iconMap[iconName] || <SettingOutlined />;
};