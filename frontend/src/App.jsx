import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Hospital website
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HeroSequence from './components/HeroSequence';
import QuickActions from './components/QuickActions';
import AboutSection from './components/AboutSection';
import QTrackSection from './components/QTrackSection';
import DepartmentsSection from './components/DepartmentsSection';
import DoctorsSection from './components/DoctorsSection';

// Hospital pages
import EmergencyPage from './pages/EmergencyPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import PackagesPage from './pages/PackagesPage';
import ContactPage from './pages/ContactPage';
import HospitalAuthPage from './pages/HospitalAuthPage';
import AppointmentPage from './pages/AppointmentPage';
import FindDoctorsPage from './pages/FindDoctorsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import HospitalDashboard from './pages/HospitalDashboard';

// QTrack App
import QTrackLayout from './components/layout/QTrackLayout';
import QTrackPage from './pages/QTrackPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSequence />
      <QuickActions />
      <AboutSection />
      <QTrackSection />
      <DepartmentsSection />
      <DoctorsSection />
    </div>
  );
}

function HospitalLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const { restoreSession } = useAuthStore();
  
  // Restore auth session on app load
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Hospital Website */}
        <Route element={<HospitalLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/diagnostics" element={<DiagnosticsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<HospitalAuthPage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/doctors" element={<FindDoctorsPage />} />
          <Route path="/departments/:slug" element={<DepartmentDetailPage />} />
        </Route>

        {/* Standalone Full-Screen Patient Dashboard (No Navbar/Footer) */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <HospitalDashboard />
          </ProtectedRoute>
        } />

        {/* QTrack Application Suite */}
        <Route element={<QTrackLayout />}>
          {/* Public */}
          <Route path="/qtrack" element={<QTrackPage />} />
          <Route path="/qtrack/login" element={<LoginPage />} />
          <Route path="/qtrack/register" element={<RegisterPage />} />

          {/* Protected: Patient — if already logged in via hospital, no re-login needed */}
          <Route path="/qtrack/patient/dashboard" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />

          {/* Protected: Doctor */}
          <Route path="/qtrack/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          {/* Protected: Admin */}
          <Route path="/qtrack/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
