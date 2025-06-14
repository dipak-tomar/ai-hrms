import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import NewEmployeePage from './pages/NewEmployeePage';
import DepartmentListPage from './pages/DepartmentListPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import NewDepartmentPage from './pages/NewDepartmentPage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import PerformancePage from './pages/PerformancePage';
import ReportsPage from './pages/ReportsPage';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-surface font-body">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/new" element={<NewEmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/departments/new" element={<NewDepartmentPage />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Routes>
      
      {user && <ChatbotWidget />}
    </div>
  );
}

export default App;