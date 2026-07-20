import React, { useState } from 'react';
import {
  School,
  Award,
  Ban,
  Search,
  PlusCircle,
  CheckCircle,
  Shield,
  FileText,
  Users,
} from 'lucide-react';
import { Certificate } from '../types';
import { ADMIN_PROFILE_IMAGE, STITCH_UNIVERSITY_LOGO } from '../data';
import { generateRandomHash, generateRandomChecksum } from '../utils/crypto';
import CertificateCard from '../components/CertificateCard';
import { uploadCertificatePDF } from '../services/api';
import { issueCertificateOnChain } from '../services/blockchainService';

interface AdminDashboardProps {
  certificates: Certificate[];
  onAddCertificate: (cert: Certificate) => void;
  onUpdateCertificates: (certs: Certificate[]) => void;
}

type AdminTab = 'dashboard' | 'issue' | 'certificates';

export default function AdminDashboard({
  certificates,
  onAddCertificate,
  onUpdateCertificates,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueSuccessMsg, setIssueSuccessMsg] = useState('');

  // Form state cấp phát mới
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [courseProgram, setCourseProgram] = useState('Cử nhân Khoa học Máy tính');
  const [issueDate, setIssueDate] = useState(
    new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
  );
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);

  // Xử lý nộp form cấp chứng chỉ mới (phối hợp BIN - upload PDF, và CÔNG - Smart Contract)
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !studentName) return;

    setIsIssuing(true);
    setIssueSuccessMsg('');

    try {
      let checksum = generateRandomChecksum();
      if (selectedPDF) {
        // [BIN TODO]: Gọi API upload PDF lên backend của BIN và lấy mã băm SHA256
        const uploadRes = await uploadCertificatePDF(selectedPDF);
        checksum = uploadRes.checksum || uploadRes.sha256Hash;
      }

      // [CÔNG TODO]: Gọi Smart Contract issueCertificateOnChain của CÔNG
      const txHash = await issueCertificateOnChain(studentId, studentName, courseProgram, checksum);

      const newCert: Certificate = {
        id: studentId,
        recipientName: studentName,
        courseProgram: courseProgram,
        issueDate: issueDate,
        status: 'Valid',
        txHash: txHash,
        checksum: checksum,
        issuerName: 'Trường Đại học Stitch',
        issuerLogo: STITCH_UNIVERSITY_LOGO,
        timestamp: new Date().toUTCString(),
      };

      onAddCertificate(newCert);
      setIssueSuccessMsg(`Đã cấp phát thành công văn bằng cho sinh viên ${studentName} trên Blockchain!`);
      
      // Reset form
      setStudentId('');
      setStudentName('');
      setSelectedPDF(null);
    } catch (err) {
      console.error('Lỗi khi cấp phát:', err);
    } finally {
      setIsIssuing(false);
    }
  };

  // Thu hồi chứng chỉ (Revoke)
  const handleRevoke = (certId: string) => {
    const updated = certificates.map((c) => (c.id === certId ? { ...c, status: 'Revoked' as const } : c));
    onUpdateCertificates(updated);
  };

  const filteredCertificates = certificates.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseProgram.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-fadeIn">
      {/* Admin Profile Bar */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 mb-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={ADMIN_PROFILE_IMAGE}
            alt="Admin"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#001e40]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#001e40]">TS. Eleanor Vance</h1>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-wider">
                Quản trị viên Cấp cao
              </span>
            </div>
            <p className="font-sans text-xs text-[#505f76] flex items-center gap-1.5 mt-0.5">
              <School className="w-3.5 h-3.5 text-[#001e40]" />
              <span>Phòng Đào tạo - Trường Đại học Stitch</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f4f3f8] p-1 rounded-lg border border-[#e0e2ec]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded font-semibold text-xs transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-white text-[#001e40] shadow-xs' : 'text-[#505f76]'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('issue')}
            className={`px-4 py-2 rounded font-semibold text-xs transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'issue' ? 'bg-[#001e40] text-white shadow-xs' : 'text-[#505f76]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Cấp chứng chỉ mới</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded font-semibold text-xs transition-all cursor-pointer ${
              activeTab === 'certificates' ? 'bg-white text-[#001e40] shadow-xs' : 'text-[#505f76]'
            }`}
          >
            Quản lý văn bằng ({certificates.length})
          </button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Stats Cards (Điểm chạm BIN TODO - API thống kê) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-[#c3c6d1] p-6 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-[#505f76] mb-2">
                <span className="text-xs font-bold uppercase">Tổng văn bằng đã cấp</span>
                <Award className="w-5 h-5 text-[#001e40]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#001e40]">{certificates.length}</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-2">↑ 12% so với học kỳ trước</p>
            </div>

            <div className="bg-white border border-[#c3c6d1] p-6 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-[#505f76] mb-2">
                <span className="text-xs font-bold uppercase">Lượt xác minh công khai</span>
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#001e40]">1,452</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-2">Bảo mật tuyệt đối qua Smart Contract</p>
            </div>

            <div className="bg-white border border-[#c3c6d1] p-6 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-[#505f76] mb-2">
                <span className="text-xs font-bold uppercase">Sinh viên có hồ sơ</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#001e40]">85</div>
              <p className="text-[11px] text-[#505f76] font-semibold mt-2">Đang đồng bộ với cơ sở dữ liệu MySQL</p>
            </div>
          </div>

          {/* Recent activity preview */}
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#001e40] mb-4">Văn bằng mới cấp gần đây</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.slice(0, 4).map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} showActions={false} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ISSUE CERTIFICATE FORM (Phối hợp BIN Multer & CÔNG Smart Contract) */}
      {activeTab === 'issue' && (
        <div className="bg-white border border-[#c3c6d1] rounded-2xl p-8 shadow-sm max-w-2xl mx-auto animate-fadeIn">
          <h2 className="font-serif text-2xl font-bold text-[#001e40] mb-2 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-[#001e40]" />
            <span>Cấp phát Chứng chỉ Học thuật mới</span>
          </h2>
          <p className="text-xs text-[#505f76] mb-6">
            Khi nhấn ban hành, hệ thống sẽ tự động băm tệp tin PDF (SHA-256) và gọi Smart Contract để ghi nhận vĩnh viễn lên Blockchain.
          </p>

          {issueSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{issueSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleIssueCertificate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#001e40] uppercase mb-1">Mã số Sinh viên / ID Văn bằng</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="VD: STU-2024-9901"
                className="w-full px-4 py-2.5 bg-[#f9f9fe] border border-[#c3c6d1] rounded text-sm focus:border-[#001e40] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001e40] uppercase mb-1">Họ và tên Sinh viên</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="VD: Nguyễn Văn An"
                className="w-full px-4 py-2.5 bg-[#f9f9fe] border border-[#c3c6d1] rounded text-sm focus:border-[#001e40] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001e40] uppercase mb-1">Chương trình Đào tạo / Ngành học</label>
              <select
                value={courseProgram}
                onChange={(e) => setCourseProgram(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f9f9fe] border border-[#c3c6d1] rounded text-sm focus:border-[#001e40] outline-none"
              >
                <option value="Cử nhân Khoa học Máy tính">Cử nhân Khoa học Máy tính</option>
                <option value="Thạc sĩ Phân tích Dữ liệu">Thạc sĩ Phân tích Dữ liệu</option>
                <option value="Cử nhân Quản trị Kinh doanh">Cử nhân Quản trị Kinh doanh</option>
                <option value="Tiến sĩ Vật lý & Kỹ thuật">Tiến sĩ Vật lý & Kỹ thuật</option>
                <option value="Chứng chỉ Mật mã học & Blockchain">Chứng chỉ Mật mã học & Blockchain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001e40] uppercase mb-1">Tệp tin PDF gốc (Để băm SHA-256)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedPDF(e.target.files?.[0] || null)}
                className="w-full text-xs text-[#505f76] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#001e40] file:text-white hover:file:bg-[#003366]"
              />
            </div>

            <button
              type="submit"
              disabled={isIssuing}
              className="w-full bg-[#001e40] hover:bg-[#003366] disabled:opacity-50 text-white py-3.5 rounded font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-4"
            >
              {isIssuing ? (
                <span>Đang ghi nhận Smart Contract...</span>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  <span>Ký & Ban hành Văn bằng lên Blockchain</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MANAGE CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-serif text-xl font-bold text-[#001e40]">Quản lý toàn bộ Danh sách Văn bằng</h3>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên, ID, ngành học..."
                className="w-full pl-9 pr-4 py-2 bg-[#f9f9fe] border border-[#c3c6d1] rounded text-xs outline-none focus:border-[#001e40]"
              />
              <Search className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCertificates.map((cert) => (
              <div key={cert.id} className="relative group">
                <CertificateCard certificate={cert} />
                {cert.status === 'Valid' && (
                  <button
                    onClick={() => handleRevoke(cert.id)}
                    className="absolute top-4 right-28 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Thu hồi văn bằng</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
