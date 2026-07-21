import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các components tái sử dụng
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoControls from './components/DemoControls';

// Import các trang chính từ src/pages/
import Home from './pages/Home';
import Login from './pages/Login';
import Verify from './pages/Verify';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Import custom hook & data ban đầu
import { useWallet } from './hooks/useWallet';
import { Certificate } from './types';
import { INITIAL_CERTIFICATES } from './data';

export default function App() {
  const { account, isConnected, connectWallet, error } = useWallet();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Khởi tạo và đồng bộ dữ liệu chứng chỉ (từ localStorage hoặc sau này từ API của BIN)
  useEffect(() => {
    const cached = localStorage.getItem('chainverify_certs');
    if (cached) {
      try {
        setCertificates(JSON.parse(cached));
      } catch (e) {
        setCertificates(INITIAL_CERTIFICATES);
      }
    } else {
      setCertificates(INITIAL_CERTIFICATES);
    }
  }, []);

  // Hàm lưu và cập nhật trạng thái văn bằng (chia sẻ cho cả nhóm)
  const saveCertificates = (updatedCerts: Certificate[]) => {
    setCertificates(updatedCerts);
    localStorage.setItem('chainverify_certs', JSON.stringify(updatedCerts));
  };

  const handleAddCertificate = (newCert: Certificate) => {
    const updated = [newCert, ...certificates];
    saveCertificates(updated);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f9f9fe] text-[#1a1c1f] font-sans flex flex-col antialiased">
        {/* Thanh điều khiển router cho nhóm test nhanh */}
        <DemoControls />

        {/* Thanh điều hướng chính */}
        <Navbar
          isConnected={isConnected}
          account={account}
          onConnectWallet={connectWallet}
        />

        {/* Cấu hình Định tuyến React Router chuẩn theo thiết kế */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-16">
          <Routes>
            {/* Route / : Trang chủ giới thiệu */}
            <Route
              path="/"
              element={
                <Home
                  isConnected={isConnected}
                  onConnectWallet={connectWallet}
                />
              }
            />

            {/* Route /login : Trang kết nối ví MetaMask */}
            <Route
              path="/login"
              element={
                <Login
                  isConnected={isConnected}
                  account={account}
                  onConnectWallet={connectWallet}
                  error={error}
                />
              }
            />

            {/* Route /verify : Trang tra cứu & xác minh văn bằng */}
            <Route
              path="/verify"
              element={<Verify certificates={certificates} />}
            />

            {/* Route /student : Cổng Sinh viên & tải chứng chỉ */}
            <Route
              path="/student"
              element={<StudentDashboard certificates={certificates} />}
            />

            {/* Route /admin : Cổng Quản trị viên & cấp phát */}
            <Route
              path="/admin"
              element={
                <AdminDashboard
                  certificates={certificates}
                  onAddCertificate={handleAddCertificate}
                  onUpdateCertificates={saveCertificates}
                />
              }
            />

            {/* Route /dashboard : Bí danh chuyển tới /admin */}
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

            {/* Route fallback cho các đường dẫn không hợp lệ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Chân trang chung */}
        <Footer />
      </div>
    </Router>
  );
}
