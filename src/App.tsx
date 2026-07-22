import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Provider & Protected Route
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public / Guest Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Verify from './pages/Verify';
import About from './pages/About';
import Contact from './pages/Contact';

// Student Pages
import StudentOverview from './pages/student/StudentOverview';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentProfile from './pages/student/StudentProfile';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminBlockchain from './pages/admin/AdminBlockchain';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

// Types & Services
import { Certificate } from './types';
import { getCertificatesFromBackend } from './services/api';

export default function App() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Khởi tạo và đồng bộ dữ liệu chứng chỉ 100% từ MySQL Database (Backend API port 5000)
  useEffect(() => {
    getCertificatesFromBackend().then((apiCerts) => {
      setCertificates(apiCerts || []);
      if (apiCerts && apiCerts.length > 0) {
        localStorage.setItem('chainverify_certs', JSON.stringify(apiCerts));
      }
    });
  }, []);

  const saveCertificates = (updatedCerts: Certificate[]) => {
    setCertificates(updatedCerts);
    localStorage.setItem('chainverify_certs', JSON.stringify(updatedCerts));
  };

  const handleAddCertificate = (newCert: Certificate) => {
    const updated = [newCert, ...certificates];
    saveCertificates(updated);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#f9f9fe] text-[#1a1c1f] font-sans flex flex-col antialiased">
          {/* Main Production Navigation */}
          <Navbar />

          {/* Application Routes */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
            <Routes>
              {/* Guest / Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verify certificates={certificates} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentOverview certificates={certificates} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/certificates"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentCertificates certificates={certificates} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProfile certificates={certificates} />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminOverview certificates={certificates} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/certificates"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCertificates
                      certificates={certificates}
                      onAddCertificate={handleAddCertificate}
                      onUpdateCertificates={saveCertificates}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blockchain"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminBlockchain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAuditLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback for invalid paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
