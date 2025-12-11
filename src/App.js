import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import Layout from './components/layout/Layout';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Department from './pages/Department';
import Designation from './pages/Designation';
import Branch from './pages/Branch';
import ManageEmployee from './pages/manageEmployee';
import Termination from './pages/Termination';
import Promotion from './pages/Promotion';
import EmployeePermanent from './pages/EmployeePermanent';
import Warning from './pages/Warning';
import AddEmployeeForm from './pages/AddEmployee';
import Profile from './pages/employeeDetails';
import ManageHoliday from './pages/leaveManagement/ManageHoliday';
import LeaveType from './pages/leaveManagement/LeaveType';
import PublicHoliday from './pages/leaveManagement/PublicHoliday';
import EarnLeaveConfigure from './pages/leaveManagement/EarnLeaveConfigure';
import WeeklyHoliday from './pages/leaveManagement/WeeklyHoliday';
import Award from './pages/Award';
import Notice from './pages/Notice';
import TrainingType from './pages/Training/TrainingType';
import TrainingList from './pages/Training/TrainingList';
import TrainingReport from './pages/Training/TrainingReport';
import ManageWorkShift from './pages/Attendance/ManageWorkShift';
import MonthlyPayGrade from './pages/Payroll/MonthlyPayGrade';
import PerfomanceCategory from './pages/Perfomance/PerfomanceCategory';
import PerfomanceCriteria from './pages/Perfomance/PerfomanceCriteria';
import EmployeePerfomance from './pages/Perfomance/EmployeePerfomanceList';
import SummaryReport from './pages/Perfomance/SummaryReport';
import ApplyForLeave from './pages/leaveManagement/ApplyForLeave';
import RequestedApplication from './pages/leaveManagement/RequestedApplication';
import LeaveReport from './pages/leaveManagement/LeaveReport';
import MyLeaveReport from './pages/leaveManagement/MyLeaveReport';
import JobPost from './pages/Requirement/JobPost';
import JobCandidate from './pages/Requirement/JobCandidate';
import LeaveSummaryReport from './pages/leaveManagement/LeaveSummaryReport';
import DashboardAttendance from './pages/Attendance/DashboardAttendance';
import ManualAttendance from './pages/Attendance/ManualAttendance';
import AttendanceSummaryReport from './pages/Attendance/AttendanceSummaryReport';
import DailyAttendance from './pages/Attendance/DailyAttendance';
import MonthlyAttendance from './pages/Attendance/MonthlyAttendance';
import MyAttendanceReport from './pages/Attendance/MyAttendanceReport';
import ChangePassword from './pages/Administration/ChangePassword';
import AddPermission from './pages/Administration/AddPermission';
import AddRole from './pages/Administration/AddRole';
import HourlyPayGrade from './pages/Payroll/HourlyPayGrade';
import TaxRuleSetup from './pages/Payroll/setup/TaxRuleSetup';
import LateConfiguration from './pages/Payroll/setup/LateConfiguration';
import Allowance from './pages/Payroll/Allowance';
import Deductions from './pages/Payroll/Deductions';
import GenerateSalarySheet from './pages/Payroll/GenerateSalarySheet';
import PaymentHistory from './pages/Payroll/PaymentHistory';
import BonusSetting from './pages/Payroll/BonusSetting';
import MyPayroll from './pages/Payroll/MyPayroll';
import ApproveWorkHour from './pages/Payroll/ApproveWorkHour';
import GenerateBonus from './pages/Payroll/GenerateBonus';
import GenerateBulkSalarySheet from './pages/Payroll/GenerateBulkSalarySheet';
import AddSalarySheet from './pages/Payroll/AddSalarySheet';
import EmployeePerformanceForm from './pages/Perfomance/EmployeePerfomanceForm';
import ViewEmployeePerformance from './pages/Perfomance/ViewEmployeePerfomance';
import AddGenerateBonus from './pages/Payroll/AddGenerateBonus';
import EmployeePayslip from './pages/Payroll/EmployeePayslip';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path='administration'>
              <Route path='manage-role' >
                <Route path='add-role' element={<AddRole />} />
                <Route path='add-role-permission' element={<AddPermission />} />
              </Route>
              <Route path='change-password' element={<ChangePassword />} />
            </Route>
            <Route path='employee-management'>
              <Route path='department' element={<Department />} />
              <Route path='designation' element={<Designation />} />
              <Route path='branch' element={<Branch />} />
              <Route path='manage-employee'>
                <Route index element={<ManageEmployee />} />
                <Route path='create' element={<AddEmployeeForm />} />
                <Route path='edit/:id' element={<AddEmployeeForm />} />
                <Route path='profile/:id' element={<Profile />} />
              </Route>              <Route path='termination' element={<Termination />} />
              <Route path='promotion' element={<Promotion />} />
              <Route path='employee-permanent' element={<EmployeePermanent />} />
              <Route path='warning' element={<Warning />} />


            </Route>
            <Route path='leave-management'>
              <Route path='setup'>
                <Route path='manage-holiday' element={<ManageHoliday />} />
                <Route path='public-holiday' element={<PublicHoliday />} />
                <Route path='weekly-holiday' element={<WeeklyHoliday />} />
                <Route path='leave-type' element={<LeaveType />} />
                <Route path='earn-leave-configure' element={<EarnLeaveConfigure />} />
              </Route>
              <Route path='leave-application'>
                <Route path='apply-for-leave' element={<ApplyForLeave />} />
                <Route path='requested-application' element={<RequestedApplication />} />
              </Route>
              <Route path='report'>
                <Route path='leave-report' element={<LeaveReport />} />
                <Route path='summary-report' element={<LeaveSummaryReport />} />
                <Route path='my-leave-report' element={<MyLeaveReport />} />
              </Route>

            </Route>
            <Route path='attendance'>
              <Route path='setup'>
                <Route path='manage-work-shift' element={<ManageWorkShift />} />
                <Route path='dashboard-attendance' element={<DashboardAttendance />} />
              </Route>
              <Route path='report' >
                <Route path='daily-attendance' element={<DailyAttendance />} />
                <Route path='monthly-attendance' element={<MonthlyAttendance />} />
                <Route path='my-attendance-report' element={<MyAttendanceReport />} />
                <Route path='summary-report' element={<AttendanceSummaryReport />} />
              </Route>
              <Route path='manual-attendance' element={<ManualAttendance />} />
            </Route>

            <Route path='payroll'>
              <Route path='setup'>

                <Route path='tax-rule-setup' element={<TaxRuleSetup />} />
                <Route path='late-configuration' element={<LateConfiguration />} />
              </Route>
              <Route path='allowance' element={<Allowance />} />
              <Route path='deduction' element={<Deductions />} />
              <Route path='monthly-pay-grade' element={<MonthlyPayGrade />} />
              <Route path='hourly-pay-grade' element={<HourlyPayGrade />} />
              <Route path='generate-salary-sheet' element={<GenerateSalarySheet />} />
              <Route path='report' >
                <Route path='payment-history' element={<PaymentHistory />} />
                <Route path='my-payroll' element={<MyPayroll />} />
              </Route>
              <Route path='manage-work-hour'>
                <Route path='approve-work-hour' element={<ApproveWorkHour />} />
              </Route>
              <Route path='manage-bonus' >
                <Route path='bonus-setting' element={<BonusSetting />} />
                <Route path='generate-bonus' element={<GenerateBonus />} />
              </Route>
              <Route path='add-generate-bonus' element={<AddGenerateBonus />} />
               <Route path='salary'>
                <Route path='payslip/:id' element={<EmployeePayslip />} />
               </Route>
              
            </Route>
            <Route path='salary'>
                <Route path='generate-bulk' element={<GenerateBulkSalarySheet />} />
                <Route path='generate' element={<AddSalarySheet />} />
                <Route path='payslip/:id' element={<EmployeePayslip />} />
              </Route>

            <Route path='performance-category' element={<PerfomanceCategory />} />
            <Route path='performance-criteria' element={<PerfomanceCriteria />} />
            <Route path='employee-performance' element={<EmployeePerfomance />} />
            <Route path='performance-summary-report' element={<SummaryReport />} />
            <Route path='add-employee-perfomance' element={<EmployeePerformanceForm />} />
            <Route path='employee-performance/edit/:id' element={<EmployeePerformanceForm />} />
            <Route path='employee-performance/view/:id' element={<ViewEmployeePerformance />} />



            <Route path='job-post' element={<JobPost />} />
            <Route path='job-candidate' element={<JobCandidate />} />

            <Route path='training-type' element={<TrainingType />} />
            <Route path='training-list' element={<TrainingList />} />
            <Route path='training-report' element={<TrainingReport />} />

            <Route path='award' element={<Award />} />
            <Route path='notice' element={<Notice />} />
          </Route>

        </Routes>
      </Router>
    </ConfigProvider>
  );
}


export default App;