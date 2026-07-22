import React from 'react';
import { School, ShieldCheck, Download, Mail, Phone, MapPin, CheckCircle2, User } from 'lucide-react';
import { STUDENT_PROFILE_IMAGE } from '../../data';
import { Certificate } from '../../types';

interface StudentProfileProps {
  certificates: Certificate[];
}

export default function StudentProfile({ certificates }: StudentProfileProps) {
  const handleExportStudentSummary = () => {
    const headers = ['Mã ID,Chương trình Đào tạo,Đơn vị Cấp,Ngày ban hành,SHA256 Checksum,TxHash'];
    const rows = certificates.map(
      (c) => `"${c.id}","${c.courseProgram}","${c.issuerName}","${c.issueDate}","${c.checksum}","${c.txHash}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HoSoAcademic_AlexJohnson_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full animate-fadeIn max-w-4xl mx-auto py-2 space-y-8">
      {/* Profile Card */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <img
          src={STUDENT_PROFILE_IMAGE}
          alt="Alex Johnson"
          className="w-28 h-28 rounded-full object-cover border-4 border-[#001e40] p-1 shadow-sm shrink-0"
        />
        <div className="flex-grow space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#001e40]">Alex Johnson</h1>
              <span className="text-xs font-mono font-bold text-[#505f76]">Mã Sinh Viên: STU-2024-8891</span>
            </div>
            <button
              onClick={handleExportStudentSummary}
              className="bg-[#001e40] hover:bg-[#003366] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all mx-auto sm:mx-0"
            >
              <Download className="w-4 h-4" />
              <span>Xuất trích lục CSV</span>
            </button>
          </div>

          <p className="font-sans text-sm text-[#505f76] flex items-center justify-center sm:justify-start gap-2">
            <School className="w-4 h-4 text-[#001e40]" />
            <span>Khoa Khoa học Máy tính & Mật mã - Trường Đại học Stitch</span>
          </p>

          <div className="pt-3 border-t border-[#f0f1f5] flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-sans">
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Định danh Web3: Sepolia Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Khóa công khai: 0x8f2a...d6f9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic & Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#c3c6d1] p-6 md:p-8 rounded-2xl shadow-2xs space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#001e40] border-b border-[#f0f1f5] pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-[#001e40]" />
            <span>Thông tin Đào tạo</span>
          </h3>
          <div className="space-y-3 font-sans text-sm">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-[#505f76]">Chuyên ngành:</span>
              <span className="font-bold text-[#001e40]">Khoa học Máy tính (B.S.)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-[#505f76]">Khóa học:</span>
              <span className="font-bold text-[#001e40]">2020 – 2024</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-[#505f76]">Tình trạng học tập:</span>
              <span className="font-bold text-emerald-600">Đã tốt nghiệp (Graduated)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#505f76]">Điểm trung bình (GPA):</span>
              <span className="font-bold text-[#001e40]">3.85 / 4.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d1] p-6 md:p-8 rounded-2xl shadow-2xs space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#001e40] border-b border-[#f0f1f5] pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#001e40]" />
            <span>Liên hệ & Bảo mật</span>
          </h3>
          <div className="space-y-3 font-sans text-sm">
            <div className="flex items-center gap-3 py-1">
              <Mail className="w-4 h-4 text-[#505f76]" />
              <span>alex.johnson@student.stitch.edu</span>
            </div>
            <div className="flex items-center gap-3 py-1">
              <Phone className="w-4 h-4 text-[#505f76]" />
              <span>(+84) 988 123 456</span>
            </div>
            <div className="flex items-center gap-3 py-1">
              <MapPin className="w-4 h-4 text-[#505f76]" />
              <span>Khu đô thị Đại học, TP. Hồ Chí Minh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
