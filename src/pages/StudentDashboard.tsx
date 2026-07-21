import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  Award,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Search,
  FileText,
} from 'lucide-react';
import { Certificate } from '../types';
import { STUDENT_PROFILE_IMAGE } from '../data';
import CertificateCard from '../components/CertificateCard';
import QRCodeGenerator from '../components/QRCodeGenerator';

/**
 * [THANH - MODULE 20 COMPLETED]: Cổng Thông tin & Quản lý Văn bằng Sinh viên
 * - Bổ sung thanh tìm kiếm & bộ lọc nội bộ cho sinh viên.
 * - Tính năng trích xuất danh sách văn bằng cá nhân ra định dạng CSV.
 */

interface StudentDashboardProps {
  certificates: Certificate[];
}

export default function StudentDashboard({ certificates }: StudentDashboardProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedChecksum, setCopiedChecksum] = useState(false);
  const [simulatedAction, setSimulatedAction] = useState('');

  // STT 36 (Module 20): Tìm kiếm và lọc văn bằng sinh viên
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Valid'>('ALL');

  // Lọc chứng chỉ của sinh viên (hiện đang dùng ID mẫu, sau này lọc theo studentId từ ví)
  const baseStudentCerts = certificates.filter(
    (c) =>
      c.id === 'STU-MCS24' ||
      c.id === 'STU-ACR23' ||
      c.id === 'STU-BAR23' ||
      c.recipientName.toLowerCase().includes('student') ||
      c.recipientName.toLowerCase().includes('profile')
  );

  const studentCerts = baseStudentCerts.filter((c) => {
    const matchesSearch =
      c.courseProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyText = (text: string, isHash: boolean) => {
    navigator.clipboard.writeText(text);
    if (isHash) {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedChecksum(true);
      setTimeout(() => setCopiedChecksum(false), 2000);
    }
  };

  const handleDownloadPDF = (cert: Certificate) => {
    setSimulatedAction('Đang chuẩn bị tệp tin PDF gốc kèm chữ ký Blockchain...');
    setTimeout(() => {
      setSimulatedAction(`Đã tải xuống thành công: Certificate_${cert.id}.pdf`);
      setTimeout(() => setSimulatedAction(''), 4000);
    }, 1200);
  };

  // STT 37 (Module 20): Xuất báo cáo chứng chỉ sinh viên ra file CSV
  const handleExportStudentSummary = () => {
    const headers = ['Mã ID,Chương trình Đào tạo,Đơn vị Cấp,Ngày ban hành,SHA256 Checksum,TxHash'];
    const rows = studentCerts.map(
      (c) => `"${c.id}","${c.courseProgram}","${c.issuerName}","${c.issueDate}","${c.checksum}","${c.txHash}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HoSoVanBang_AlexJohnson_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Thông báo hành động giả lập */}
      {simulatedAction && (
        <div className="fixed top-20 right-6 bg-[#001e40] text-white px-5 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 text-xs font-semibold animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{simulatedAction}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 mb-8 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={STUDENT_PROFILE_IMAGE}
            alt="Hồ sơ sinh viên"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#001e40] p-1 shadow-sm shrink-0"
          />
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start mb-1">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#001e40]">Alex Johnson</h1>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-xs font-semibold w-fit mx-auto md:mx-0">
                Mã SV: STU-2024-8891
              </span>
            </div>
            <p className="font-sans text-sm text-[#505f76] flex items-center justify-center md:justify-start gap-1.5 mb-4">
              <School className="w-4 h-4 text-[#001e40]" />
              <span>Khoa Khoa học Máy tính & Kỹ thuật - Trường Đại học Stitch</span>
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs text-[#505f76]">
              <span className="bg-[#f4f3f8] px-3 py-1.5 rounded border border-[#e0e2ec]">
                Văn bằng sở hữu: <strong className="text-[#001e40]">{baseStudentCerts.length}</strong>
              </span>
              <span className="bg-[#f4f3f8] px-3 py-1.5 rounded border border-[#e0e2ec] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Trạng thái: <strong className="text-emerald-700">Đã xác minh Web3</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Nút Xuất báo cáo chứng chỉ Module 20 */}
        <button
          onClick={handleExportStudentSummary}
          className="bg-[#001e40] hover:bg-[#003366] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95"
          title="Tải về trích lục danh sách văn bằng"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất trích lục (CSV)</span>
        </button>
      </div>

      {/* Grid danh sách chứng chỉ & Bộ lọc Module 20 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="font-serif text-xl font-bold text-[#001e40] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#001e40]" />
            <span>Danh sách Chứng chỉ & Văn bằng của tôi</span>
          </h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên văn bằng, ID..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#c3c6d1] rounded text-xs outline-none focus:border-[#001e40]"
              />
              <Search className="w-3.5 h-3.5 text-[#737780] absolute left-2.5 top-2" />
            </div>
          </div>
        </div>

        {studentCerts.length === 0 ? (
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-10 text-center text-[#505f76] text-sm">
            Không tìm thấy chứng chỉ nào khớp với từ khóa tìm kiếm.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentCerts.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onSelect={(selected) => setSelectedCert(selected)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal / Section Chi tiết chứng chỉ khi chọn */}
      {selectedCert && (
        <div className="bg-white border-2 border-[#001e40] rounded-2xl p-6 md:p-8 mt-8 shadow-md animate-fadeIn">
          <div className="flex justify-between items-start mb-6 border-b border-[#f0f1f5] pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#001e40]">
                Chi tiết Văn bằng: {selectedCert.courseProgram}
              </h3>
              <p className="text-xs text-[#505f76] mt-1">Mã định danh: {selectedCert.id}</p>
            </div>
            <button
              onClick={() => setSelectedCert(null)}
              className="text-[#737780] hover:text-[#001e40] font-bold text-sm bg-[#f4f3f8] px-3 py-1 rounded cursor-pointer"
            >
              ✕ Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-6">
            <div className="space-y-4 text-sm font-sans">
              <div className="flex justify-between border-b border-[#f0f1f5] pb-2">
                <span className="text-[#505f76]">Sinh viên:</span>
                <span className="font-bold text-[#001e40]">{selectedCert.recipientName}</span>
              </div>
              <div className="flex justify-between border-b border-[#f0f1f5] pb-2">
                <span className="text-[#505f76]">Đơn vị cấp:</span>
                <span className="font-bold text-[#001e40]">{selectedCert.issuerName}</span>
              </div>
              <div className="flex justify-between border-b border-[#f0f1f5] pb-2">
                <span className="text-[#505f76]">Ngày ban hành:</span>
                <span className="font-semibold text-[#001e40]">{selectedCert.issueDate}</span>
              </div>

              <div className="pt-2">
                <span className="text-xs text-[#737780] block mb-1">SHA-256 Checksum (Mã băm PDF):</span>
                <div className="flex items-center gap-2 bg-[#f9f9fe] p-2 rounded border border-[#e0e2ec] font-mono text-xs break-all">
                  <span className="flex-grow">{selectedCert.checksum}</span>
                  <button
                    onClick={() => handleCopyText(selectedCert.checksum, false)}
                    className="p-1.5 hover:bg-gray-200 rounded text-[#001e40] cursor-pointer"
                  >
                    {copiedChecksum ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <QRCodeGenerator certId={selectedCert.id} recipientName={selectedCert.recipientName} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#f0f1f5]">
            <button
              onClick={() => handleDownloadPDF(selectedCert)}
              className="bg-[#001e40] hover:bg-[#003366] text-white px-6 py-2.5 rounded font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải bản gốc PDF (có đính kèm chữ ký)</span>
            </button>

            <a
              href={`https://sepolia.etherscan.io/tx/${selectedCert.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#001e40] hover:underline flex items-center gap-1"
            >
              <span>Tra cứu giao dịch trên Etherscan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
