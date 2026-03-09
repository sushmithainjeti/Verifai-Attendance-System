import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from "@/components/ui/sonner";
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FaceRegistration from './pages/FaceRegistration';
import LiveAttendance from './pages/LiveAttendance';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/student/face-registration" element={
              <ProtectedRoute allowedRoles={['STUDENT']}><FaceRegistration /></ProtectedRoute>
            } />
            <Route path="/teacher/dashboard" element={
              <ProtectedRoute allowedRoles={['TEACHER']}><TeacherDashboard /></ProtectedRoute>
            } />
            <Route path="/teacher/attendance" element={
              <ProtectedRoute allowedRoles={['TEACHER']}><LiveAttendance /></ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
