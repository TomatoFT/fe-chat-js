import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Dashboard } from './components/dashboard/Dashboard';
import { DocumentManagement } from './components/documents/DocumentManagement';
import { DocumentIndexing } from './components/documents/DocumentIndexing';
import { ChatInterface } from './components/chat/ChatInterface';
import AddSchool from './components/management/AddSchool';
import AddProvince from './components/management/AddProvince';
import SchoolsList from './components/management/SchoolsList';
import ProvincesList from './components/management/ProvincesList';
import { UserManagement } from './components/admin/UserManagement';
import SystemTree from './components/admin/SystemTree';
import DocumentStore from './components/admin/DocumentStore';
import { SchoolManagerDashboard } from './components/school-manager/SchoolManagerDashboard';

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
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route 
                    path="dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['school_manager', 'admin', 'province_manager', 'department_manager']}>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
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
                      <ProtectedRoute allowedRoles={['school_manager', 'province_manager', 'department_manager', 'admin']}>
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
                    path="documents/indexing" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <DocumentIndexing />
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
                    path="admin/users" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <UserManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="admin/tree" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <SystemTree />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="admin/documents" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <DocumentStore />
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