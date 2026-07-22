import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Wallet, LogOut, Menu, X, Shield, User, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isConnected, account, connectWallet, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeClass =
    'font-sans text-xs md:text-sm text-[#001e40] font-bold border-b-2 border-[#001e40] py-5 h-full flex items-center transition-colors whitespace-nowrap';
  const inactiveClass =
    'font-sans text-xs md:text-sm text-[#505f76] hover:text-[#001e40] py-5 h-full flex items-center transition-colors whitespace-nowrap';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const formattedAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  return (
    <header className="w-full bg-white border-b border-[#c3c6d1] z-40 sticky top-0 shadow-2xs">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group active:scale-95 transition-transform shrink-0">
          <div className="w-8 h-8 bg-[#001e40] text-white rounded-lg flex items-center justify-center shadow-2xs">
            <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold text-[#001e40] tracking-tight leading-none">
              ChainVerify
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#505f76] font-semibold">
              {userRole === 'admin' ? 'Enterprise Admin' : userRole === 'student' ? 'Student Portal' : 'Academic Verification'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation based strictly on userRole */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full overflow-x-auto">
          {userRole === 'guest' && (
            <>
              <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : inactiveClass)} end>
                Trang chủ
              </NavLink>
              <NavLink to="/verify" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Tra cứu Văn bằng
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Giới thiệu
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Liên hệ
              </NavLink>
            </>
          )}

          {userRole === 'student' && (
            <>
              <NavLink to="/student" className={({ isActive }) => (isActive ? activeClass : inactiveClass)} end>
                Tổng quan
              </NavLink>
              <NavLink to="/student/certificates" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Văn bằng của tôi
              </NavLink>
              <NavLink to="/student/profile" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Hồ sơ cá nhân
              </NavLink>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? activeClass : inactiveClass)} end>
                Dashboard
              </NavLink>
              <NavLink to="/admin/students" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                QL Sinh viên
              </NavLink>
              <NavLink to="/admin/certificates" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                QL Văn bằng
              </NavLink>
              <NavLink to="/admin/blockchain" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Blockchain
              </NavLink>
              <NavLink to="/admin/audit-logs" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Nhật ký (Audit)
              </NavLink>
              <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                Cài đặt
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Action Section */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {isConnected && account ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f3f8] border border-[#e0e2ec] rounded-lg text-xs font-sans">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="font-mono font-bold text-[#001e40]" title={account}>
                  {formattedAccount}
                </span>
                <span className="px-1.5 py-0.5 bg-[#001e40] text-white rounded text-[9px] font-bold uppercase tracking-wide">
                  {userRole}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-rose-50 text-[#505f76] hover:text-rose-600 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (!isConnected) {
                  connectWallet();
                } else {
                  navigate('/login');
                }
              }}
              className="px-4 py-2 bg-[#001e40] hover:bg-[#003366] text-white rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <Wallet className="w-4 h-4" />
              <span>Đăng nhập Web3</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          {isConnected && account && (
            <span className="font-mono text-xs font-bold text-[#001e40] sm:hidden">
              {formattedAccount}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#001e40] hover:bg-[#f4f3f8] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#c3c6d1] px-6 py-4 space-y-3 font-sans text-sm animate-fadeIn shadow-lg">
          {userRole === 'guest' && (
            <>
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
                end
              >
                Trang chủ
              </NavLink>
              <NavLink
                to="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Tra cứu Văn bằng
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Giới thiệu
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Liên hệ
              </NavLink>
            </>
          )}

          {userRole === 'student' && (
            <>
              <NavLink
                to="/student"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
                end
              >
                Tổng quan Sinh viên
              </NavLink>
              <NavLink
                to="/student/certificates"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Văn bằng của tôi
              </NavLink>
              <NavLink
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Hồ sơ cá nhân
              </NavLink>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
                end
              >
                Admin Dashboard
              </NavLink>
              <NavLink
                to="/admin/students"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Quản lý Sinh viên
              </NavLink>
              <NavLink
                to="/admin/certificates"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Quản lý Văn bằng
              </NavLink>
              <NavLink
                to="/admin/blockchain"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Mạng Blockchain
              </NavLink>
              <NavLink
                to="/admin/audit-logs"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Nhật ký (Audit Logs)
              </NavLink>
              <NavLink
                to="/admin/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'block font-bold text-[#001e40] py-2 border-l-2 border-[#001e40] pl-3' : 'block text-[#505f76] py-2 pl-3')}
              >
                Cài đặt Hệ thống
              </NavLink>
            </>
          )}

          <div className="pt-3 border-t border-[#f0f1f5] flex flex-col gap-2">
            {isConnected && account ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất ({account.slice(0, 6)}...)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  connectWallet();
                }}
                className="w-full py-2.5 px-4 bg-[#001e40] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Đăng nhập Web3</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
