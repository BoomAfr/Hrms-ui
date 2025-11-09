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
import ManageHoliday from './pages/leaveManagement/ManageHoliday';
import LeaveType from './pages/leaveManagement/LeaveType';
import PublicHoliday from './pages/leaveManagement/PublicHoliday';
import EarnLeaveConfigure from './pages/leaveManagement/EarnLeaveConfigure';
import WeeklyHoliday from './pages/leaveManagement/WeeklyHoliday';

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
             <Route path='employee-management'>
              <Route path='department' element={<Department/>}/>
              <Route path='designation' element={<Designation/>}/>
              <Route path='branch' element={<Branch/>}/>
              <Route path='manage-employee' element={<ManageEmployee/>}/>
              <Route path='termination' element={<Termination/>}/>
              <Route path='promotion' element={<Promotion/>}/>
              <Route path='employee-permanent' element={<EmployeePermanent/>}/>
              <Route path='warning' element={<Warning/>}/>
              

             </Route>
             <Route path='leave-management'>
              <Route path='setup'>
                <Route path='manage-holiday' element={<ManageHoliday/>}/>
                <Route path='public-holiday' element={<PublicHoliday/>}/>
                <Route path='weekly-holiday' element={<WeeklyHoliday/>}/>
                <Route path='leave-type' element={<LeaveType/>}/>
                <Route path='earn-leave-configure' element={<EarnLeaveConfigure/>}/>
              </Route>
             </Route>
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}


export default App;