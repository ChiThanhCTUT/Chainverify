import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ShieldCheck, Download, School, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { Certificate } from '../../types';
import { STUDENT_PROFILE_IMAGE } from '../../data';

interface StudentOverviewProps {
  certificates: Certificate[];
}

export default function StudentOverview({ certificates }: StudentOverviewProps) {
  const navigate = useNavigate();

  const studentCerts = certificates.filter(
    (c) =>
      c.id === 'STU-MCS24' ||
      c.id === 'STU-ACR23' ||
      c.id === 'STU-BAR23' ||
      c.recipientName.toLowerCase().includes('student') ||
      c.recipientName.toLowerCase().includes('alex') ||
      certificates.length <= 10 // if small list show what's available
  );

  return (
    <div className="w-full animate-fadeIn space-y-8 py-2">
      {/* Welcome Banner */}
      <div className="bg-[#001e40] text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center md:text-left">
          <img
            src={STUDENT_PROFILE_IMAGE}
            alt="Alex Johnson"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-emerald-400 p-0.5 shadow-sm shrink-0 mx-auto md:mx-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded text-[11px] font-bold text-emerald-300 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hồ sơ đã xác thực on-chain</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">Xin chào, Alex Johnson</h1>
            <p className="font-sans text-xs text-gray-300 mt-1 flex items-center justify-center md:justify-start gap-1.5">
              <School className="w-3.5 h-3.5 text-emerald-400" />
              <span>Khoa Khoa học Máy tính - Đại học Stitch (Mã SV: STU-2024-8891)</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/student/certificates')}
          className="bg-white hover:bg-gray-100 text-[#001e40] px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <span>Xem tất cả văn bằng</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#505f76] uppercase tracking-wider mb-1">Văn bằng sở hữu</p>
            <h3 className="font-serif text-3xl font-bold text-[#001e40]">{studentCerts.length}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#001e40] rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#505f76] uppercase tracking-wider mb-1">Xác minh Smart Contract</p>
            <h3 className="font-serif text-3xl font-bold text-emerald-600">100%</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-6 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#505f76] uppercase tracking-wider mb-1">Trạng thái định danh</p>
            <h3 className="font-sans text-base font-bold text-[#001e40] mt-1">Hợp lệ (Valid)</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Certificates Preview */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#f0f1f5] pb-4 mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#001e40]">Văn bằng vừa cấp gần đây</h2>
            <p className="text-xs text-[#505f76] mt-0.5">Danh sách trích xuất trực tiếp từ Smart Contract</p>
          </div>
          <button
            onClick={() => navigate('/student/certificates')}
            className="text-xs font-bold text-[#001e40] hover:underline flex items-center gap-1"
          >
            <span>Quản lý văn bằng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {studentCerts.length === 0 ? (
          <div className="text-center py-12 text-[#505f76] text-sm">
            Chưa có văn bằng nào được ghi nhận cho hồ sơ của bạn.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentCerts.slice(0, 4).map((cert) => (
              <div
                key={cert.id}
                onClick={() => navigate('/student/certificates')}
                className="p-5 border border-[#e0e2ec] rounded-xl hover:border-[#001e40] transition-all cursor-pointer flex items-center justify-between gap-4 bg-[#f9f9fe] hover:bg-white"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#505f76] block mb-1">Mã định danh: {cert.id}</span>
                  <h4 className="font-serif font-bold text-[#001e40] text-base line-clamp-1">{cert.courseProgram}</h4>
                  <p className="text-xs text-[#505f76] mt-1">{cert.issuerName}</p>
                </div>
                <div className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold shrink-0">
                  {cert.status || 'Valid'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
