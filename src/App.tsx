import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { DocumentManagement } from './components/documents/DocumentManagement';
import { ChatInterface } from './components/chat/ChatInterface';
import AddSchool from './components/management/AddSchool';
import AddProvince from './components/management/AddProvince';
import SchoolsList from './components/management/SchoolsList';
import ProvincesList from './components/management/ProvincesList';
import DepartmentManagement from './components/admin/DepartmentManagement';
import { SchoolManagerDashboard } from './components/school-manager/SchoolManagerDashboard';
import { ChartsPage } from './components/charts/ChartsPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/school-management" replace />} />
                  <Route 
                    path="chat" 
                    element={
                      <ProtectedRoute allowedRoles={['school_manager', 'province_manager', 'department_manager']}>
                        <ChatInterface />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="add-school" 
                    element={
                      <ProtectedRoute allowedRoles={['province_manager']}>
                        <AddSchool />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="add-province" 
                    element={
                      <ProtectedRoute allowedRoles={['department_manager']}>
                        <AddProvince />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="documents" 
                    element={
                      <ProtectedRoute allowedRoles={['school_manager']}>
                        <DocumentManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="school-management" 
                    element={
                      <ProtectedRoute allowedRoles={['school_manager']}>
                        <SchoolManagerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="schools" 
                    element={
                      <ProtectedRoute allowedRoles={['province_manager', 'department_manager', 'admin']}>
                        <SchoolsList />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="provinces" 
                    element={
                      <ProtectedRoute allowedRoles={['department_manager', 'admin']}>
                        <ProvincesList />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="admin/departments" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <DepartmentManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="charts" 
                    element={
                      <ProtectedRoute allowedRoles={['school_manager', 'province_manager', 'department_manager', 'admin']}>
                        <ChartsPage />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;