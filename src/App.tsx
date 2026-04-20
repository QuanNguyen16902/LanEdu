import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth-context';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import AttendancePage from '@/pages/Attendance';
import AssignmentsPage from '@/pages/Assignments';
import EvaluationsPage from '@/pages/Evaluations';
import StudentsPage from '@/pages/Students';
import ClassManagementPage from '@/pages/ClassManagement';
import PostsPage from '@/pages/Posts';
import TeachersPage from '@/pages/Teachers';
import TuitionFeePage from '@/pages/TuitionFee';
import SchedulePage from '@/pages/Schedule';
import UnauthorizedPage from '@/pages/Unauthorized';
import '@/i18n';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
                <AttendancePage />
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
                <PostsPage />
              </ProtectedRoute>
            } />
            <Route path="/management/assignments" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                <AssignmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/evaluations" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
                <EvaluationsPage />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                <StudentsPage />
              </ProtectedRoute>
            } />
            <Route path="/classes" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                <ClassManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/teachers" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                <TeachersPage />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                <TuitionFeePage />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                <SchedulePage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <div className="p-8"><h1 className="text-2xl font-bold">Báo cáo hệ thống (Admin only)</h1></div>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <div className="p-8"><h1 className="text-2xl font-bold">Cài đặt hệ thống (Admin only)</h1></div>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
}
