import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CheckCircle, Wallet } from 'lucide-react';

interface NavbarProps {
  isConnected: boolean;
  account: string | null;
  onConnectWallet: () => void;
}

export default function Navbar({ isConnected, account, onConnectWallet }: NavbarProps) {
  const activeClass =
    'font-sans text-sm text-[#001e40] font-bold border-b-2 border-[#001e40] py-4 h-full flex items-center transition-colors';
  const inactiveClass =
    'font-sans text-sm text-[#505f76] hover:text-[#001e40] py-4 h-full flex items-center transition-colors';

  return (
    <header className="w-full bg-white border-b border-[#c3c6d1] z-40 sticky top-0 shadow-xs">
      <div className="flex justify-between items-center h-16 px-6 md:px-10 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group active:scale-95 transition-transform">
          <CheckCircle className="w-6 h-6 text-[#001e40] fill-[#001e40]/10 group-hover:rotate-12 transition-transform" />
          <span className="font-serif text-xl md:text-2xl font-bold text-[#001e40] tracking-tight">
            ChainVerify
          </span>
        </Link>

        {/* Links React Router */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <NavLink to="/verify" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Xác minh Chứng chỉ
          </NavLink>
          <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Tính năng Hệ thống
          </NavLink>
          <NavLink to="/student" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Cổng Sinh viên
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Quản trị viên
          </NavLink>
        </nav>

        {/* Wallet Button */}
        <button
          onClick={onConnectWallet}
          className={`px-4 py-2 rounded font-sans text-xs font-semibold hover:opacity-90 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
            isConnected
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-[#001e40] text-white'
          }`}
        >
          {isConnected ? (
            <>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>MetaMask: {account}</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              <span>Kết nối ví MetaMask</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
