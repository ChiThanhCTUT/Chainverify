import React from 'react';
import { Cpu, ShieldCheck, ExternalLink, Activity, Database, CheckCircle2, Lock } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../../contracts/config';

export default function AdminBlockchain() {
  return (
    <div className="w-full animate-fadeIn space-y-8 py-2">
      {/* Header Banner */}
      <div className="bg-[#001e40] text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-mono font-bold text-emerald-400 mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Mạng lưới Ethereum Sepolia Testnet - LIVE</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Hạ tầng Blockchain & Smart Contract</h1>
          <p className="font-sans text-xs text-gray-300 mt-1 max-w-2xl">
            Quản lý địa chỉ hợp đồng thông minh Solidity v0.8.20, quyền kiểm soát ban hành (Role-Based Access Control) và tra cứu các giao dịch gốc.
          </p>
        </div>

        <a
          href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS || '0x54ce6bc13beeaedec4cbb5558133efb1c0bf33e8'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
        >
          <span>Xem trên Sepolia Etherscan</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Contract Details Card */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
        <h3 className="font-serif text-xl font-bold text-[#001e40] border-b border-[#f0f1f5] pb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#001e40]" />
          <span>Thông tin Hợp đồng Thông minh (Smart Contract Info)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-sans">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#505f76] uppercase block mb-1">Địa chỉ Contract (Sepolia):</span>
              <div className="p-3 bg-[#f9f9fe] border border-[#e0e2ec] rounded-xl font-mono text-xs font-bold text-[#001e40] break-all flex items-center justify-between">
                <span>{CONTRACT_ADDRESS || '0x54ce6bc13beeaedec4cbb5558133efb1c0bf33e8'}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#505f76] uppercase block mb-1">Quyền hạn thực thi:</span>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DEFAULT_ADMIN_ROLE & AUTHORIZED_ISSUER_ROLE</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#505f76] uppercase block mb-1">Phiên bản trình biên dịch:</span>
              <div className="p-3 bg-[#f9f9fe] border border-[#e0e2ec] rounded-xl font-mono text-xs font-semibold text-[#001e40]">
                Solidity ^0.8.20 (EVM London/Paris compatible)
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#505f76] uppercase block mb-1">Đồng bộ Cơ sở dữ liệu:</span>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs font-semibold flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Cấu trúc kép: MySQL Port 5000 + Sepolia EVM Ledger</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs space-y-2">
          <div className="w-10 h-10 bg-blue-50 text-blue-800 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-[#001e40]">Mã Băm SHA-256 Checksum</h4>
          <p className="text-xs text-[#505f76] leading-relaxed">
            Mỗi tệp tin PDF trước khi ban hành được băm thành chuỗi 64 ký tự hex độc nhất. Nếu tài liệu bị chỉnh sửa dù chỉ 1 ký tự, mã băm lập tức thay đổi và phát hiện sai lệch.
          </p>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs space-y-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-[#001e40]">Chữ ký số Không thể Chối bỏ</h4>
          <p className="text-xs text-[#505f76] leading-relaxed">
            Giao dịch ban hành văn bằng được ký bằng khóa riêng tư (Private Key) từ ví MetaMask của Quản trị viên nhà trường, được xác thực bởi toàn bộ mạng lưới Ethereum.
          </p>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs space-y-2">
          <div className="w-10 h-10 bg-purple-50 text-purple-800 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-[#001e40]">Tự động Đồng bộ (Event Logs)</h4>
          <p className="text-xs text-[#505f76] leading-relaxed">
            Hợp đồng phát ra sự kiện `CertificateIssued` và `CertificateRevoked` giúp cổng tra cứu tự động cập nhật trạng thái văn bằng trên toàn cầu 24/7.
          </p>
        </div>
      </div>
    </div>
  );
}
