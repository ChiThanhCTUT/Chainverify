import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Shield, Users, School, PlusCircle, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Certificate } from '../../types';
import { ADMIN_PROFILE_IMAGE } from '../../data';
import CertificateCard from '../../components/CertificateCard';

interface AdminOverviewProps {
  certificates: Certificate[];
}

export default function AdminOverview({ certificates }: AdminOverviewProps) {
  const navigate = useNavigate();

  const validCount = certificates.filter((c) => c.status === 'Valid').length;
  const revokedCount = certificates.filter((c) => c.status === 'Revoked').length;

  return (
    <div className="w-full animate-fadeIn space-y-8 py-2">
      {/* Admin Profile Bar */}
      <div className="bg-[#001e40] text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <img
            src={ADMIN_PROFILE_IMAGE}
            alt="TS. Eleanor Vance"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-emerald-400 p-0.5 shadow-sm shrink-0 mx-auto sm:mx-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded text-[11px] font-bold text-emerald-300 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Quản trị viên Cấp cao (Authorized Issuer)</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">TS. Eleanor Vance</h1>
            <p className="font-sans text-xs text-gray-300 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <School className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phòng Đào tạo & Quản lý Văn bằng - Trường Đại học Stitch</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/certificates')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ban hành văn bằng mới</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-[#505f76] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Văn Bằng Đã Cấp</span>
            <Award className="w-5 h-5 text-[#001e40]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#001e40]">{certificates.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Đã ghi nhận trên Blockchain</span>
          </p>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-[#505f76] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Văn Bằng Hợp Lệ</span>
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-600">{validCount}</div>
          <p className="text-[11px] text-[#505f76] font-semibold mt-2">Đủ điều kiện xác minh công khai</p>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-[#505f76] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Văn Bằng Thu Hồi</span>
            <Shield className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-rose-600">{revokedCount}</div>
          <p className="text-[11px] text-rose-600 font-semibold mt-2">Cảnh báo vô hiệu hóa on-chain</p>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-[#505f76] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Hồ sơ Sinh viên</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#001e40]">85</div>
          <p className="text-[11px] text-[#505f76] font-semibold mt-2">Đồng bộ tự động MySQL</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#f0f1f5] pb-4 mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#001e40]">Văn bằng vừa phát hành gần đây</h2>
            <p className="text-xs text-[#505f76] mt-0.5">Danh sách các chữ ký SHA-256 mới nhất được nạp vào mạng lưới</p>
          </div>
          <button
            onClick={() => navigate('/admin/certificates')}
            className="text-xs font-bold text-[#001e40] hover:underline flex items-center gap-1"
          >
            <span>Quản lý toàn bộ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12 text-[#505f76] text-sm">
            Chưa có văn bằng nào trong cơ sở dữ liệu. Nhấn nút "Ban hành văn bằng mới" ở trên để tạo.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.slice(0, 4).map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} showActions={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
