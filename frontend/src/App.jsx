import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AssistantPage from './pages/AssistantPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DoctorRoute from './components/auth/DoctorRoute';
import DoctorProfilePage from './pages/DoctorProfilePage';
import FindDoctorPage from './pages/FindDoctorPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AnalysisPage from './pages/AnalysisPage';
import AdminRoute from './components/auth/AdminRoute';
import AdminPanelPage from './pages/AdminPanelPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="find-a-doctor" element={<FindDoctorPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="analyze" element={<AnalysisPage />} />
          <Route path="chat/:appointmentId" element={<ChatPage />} />
        </Route>
        {/* --- Doctor-Only Protected Routes --- */}
        <Route element={<DoctorRoute />}>
          <Route path="doctor/profile" element={<DoctorProfilePage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="admin/panel" element={<AdminPanelPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;