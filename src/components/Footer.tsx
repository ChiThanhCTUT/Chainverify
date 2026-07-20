import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#c3c6d1] py-6 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center py-2 px-6 md:px-10 max-w-7xl mx-auto gap-4">
        <span className="font-sans text-[11px] font-bold text-[#001e40] text-center md:text-left uppercase tracking-wider">
          © 2024 ChainVerify. Hệ thống Chứng nhận Blockchain Bảo mật.
        </span>
        <nav className="flex flex-wrap justify-center gap-6">
          <a href="#" className="font-sans text-xs text-[#505f76] hover:text-[#001e40] transition-colors">
            Chính sách Bảo mật
          </a>
          <a href="#" className="font-sans text-xs text-[#505f76] hover:text-[#001e40] transition-colors">
            Điều khoản Dịch vụ
          </a>
          <div className="font-sans text-xs text-[#505f76] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Trạng thái Mạng: Sepolia Testnet (Đang hoạt động)
          </div>
        </nav>
      </div>
    </footer>
  );
}
