import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import ResumeParserPage from './pages/ResumeParserPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Wait for auth state to be loaded from storage
  useEffect(() => {
    // Short timeout to ensure the persisted state is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle redirects after auth state is loaded
  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    // If user is authenticated and on login/register pages, redirect to dashboard
    if (user && token && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate('/dashboard');
    }
    
    // Handle root path redirect only if auth state is loaded
    if (location.pathname === '/' && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, token, location.pathname, navigate, isLoading]);

  if (isLoading) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-surface font-body">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
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
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/resume-parser" element={<ResumeParserPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Routes>
      
      {user && <ChatbotWidget />}
    </div>
  );
}

export default App;