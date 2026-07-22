import React from 'react';
import { Shield, Lock, Globe, Award, CheckCircle2, Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full animate-fadeIn max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#001e40]/5 border border-[#001e40]/10 rounded-full text-xs font-semibold text-[#001e40] mb-4">
          <Shield className="w-3.5 h-3.5 text-[#001e40]" />
          <span>Tiêu chuẩn mới trong Xác minh Văn bằng Kỹ thuật số</span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#001e40] tracking-tight mb-6">
          Về ChainVerify & Nền tảng Blockchain
        </h1>
        <p className="font-sans text-base md:text-lg text-[#505f76] max-w-3xl mx-auto leading-relaxed">
          ChainVerify là hạ tầng xác thực học thuật phi tập trung thế hệ mới, kết hợp sức mạnh bảo mật tuyệt đối của mạng lưới Ethereum Blockchain với kiến trúc Web3 Enterprise để chấm dứt vấn nạn làm giả chứng chỉ.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white border border-[#c3c6d1] p-8 rounded-xl shadow-xs">
          <div className="w-12 h-12 bg-blue-50 text-[#001e40] rounded-xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#001e40] mb-3">Tính Bất biến (Immutability)</h3>
          <p className="font-sans text-sm text-[#505f76] leading-relaxed">
            Mỗi chứng chỉ khi được ban hành sẽ được băm mã hóa SHA-256 và ghi trực tiếp lên Smart Contract trên sổ cái công khai. Dữ liệu này không bao giờ bị sửa đổi hay xóa bỏ bởi bất kỳ tổ chức hay cá nhân nào.
          </p>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-8 rounded-xl shadow-xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#001e40] mb-3">Xác thực Độc lập Tức thì</h3>
          <p className="font-sans text-sm text-[#505f76] leading-relaxed">
            Các nhà tuyển dụng, trường đại học đối tác có thể kiểm tra tính hợp lệ của văn bằng chỉ trong vài giây thông qua quét mã QR hoặc đối chiếu mã hash mà không cần chờ đợi thủ tục hành chính phức tạp.
          </p>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-8 rounded-xl shadow-xs">
          <div className="w-12 h-12 bg-purple-50 text-purple-800 rounded-xl flex items-center justify-center mb-6">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#001e40] mb-3">Chuẩn hóa Toàn cầu</h3>
          <p className="font-sans text-sm text-[#505f76] leading-relaxed">
            Tuân thủ nghiêm ngặt các tiêu chuẩn mã khóa mật mã OpenBadges và W3C Verifiable Credentials, giúp văn bằng do trường cấp có giá trị công nhận trên quy mô toàn quốc và quốc tế.
          </p>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="bg-[#001e40] text-white rounded-2xl p-8 md:p-12 mb-16 shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4" />
            <span>Kiến trúc Kỹ thuật Bảo mật Cấp cao</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Quy trình Ban hành & Kiểm chứng 3 Lớp
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
            Hệ thống vận hành theo mô hình phân tách quyền lực chặt chẽ giữa nhà trường (Issuer), sinh viên sở hữu văn bằng (Holder) và nhà tuyển dụng xác minh (Verifier). Toàn bộ bằng chứng mã hóa đều được neo giữ an toàn trên mạng lưới Ethereum Sepolia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#002b5c] p-6 rounded-xl border border-[#003e80]">
            <div>
              <span className="text-emerald-400 block font-bold mb-1">MẠNG LƯỚI BLOCKCHAIN:</span>
              <span>Ethereum Sepolia Testnet / Mainnet Ready</span>
            </div>
            <div>
              <span className="text-emerald-400 block font-bold mb-1">CHƯƠNG TRÌNH SMART CONTRACT:</span>
              <span>Solidity v0.8.20 (AccessControl & Pausable)</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-emerald-400 block font-bold mb-1">MÃ BĂM TÀI LIỆU:</span>
              <span>SHA-256 Cryptographic Checksum Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Compliance */}
      <div className="bg-white border border-[#c3c6d1] rounded-xl p-8 text-center">
        <Award className="w-10 h-10 text-[#001e40] mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold text-[#001e40] mb-2">
          Cam kết Minh bạch & An toàn Học thuật
        </h3>
        <p className="font-sans text-sm text-[#505f76] max-w-2xl mx-auto leading-relaxed">
          Được phát triển bởi đội ngũ Kỹ sư Phần mềm & Mật mã Blockchain thuộc Đại học Kỹ thuật Công nghệ (CTUT), ChainVerify là giải pháp tin cậy cho chuyển đổi số toàn diện trong hệ thống giáo dục đại học hiện đại.
        </p>
      </div>
    </div>
  );
}
