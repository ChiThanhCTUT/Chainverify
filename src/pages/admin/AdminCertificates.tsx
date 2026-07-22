import React, { useState } from 'react';
import {
  Award,
  PlusCircle,
  Search,
  LayoutGrid,
  List,
  Download,
  Filter,
  Ban,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Certificate } from '../../types';
import { CONTRACT_ADDRESS } from '../../contracts/config';
import { STITCH_UNIVERSITY_LOGO } from '../../data';
import { generateRandomChecksum } from '../../utils/crypto';
import CertificateCard from '../../components/CertificateCard';
import Table, { Column } from '../../components/Table';
import { uploadCertificatePDF } from '../../services/api';
import { issueCertificateOnChain } from '../../services/blockchainService';

interface AdminCertificatesProps {
  certificates: Certificate[];
  onAddCertificate: (cert: Certificate) => void;
  onUpdateCertificates: (certs: Certificate[]) => void;
}

export default function AdminCertificates({
  certificates,
  onAddCertificate,
  onUpdateCertificates,
}: AdminCertificatesProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Valid' | 'Revoked'>('ALL');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');

  // Form Issue State
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [courseProgram, setCourseProgram] = useState('Cử nhân Khoa học Máy tính');
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueSuccessMsg, setIssueSuccessMsg] = useState('');

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !studentName) return;

    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x1234567890abcdef1234567890abcdef12345678') {
      setIssueSuccessMsg('CONTRACT_ADDRESS chưa được cấu hình. Vui lòng deploy Smart Contract trước khi ký.');
      return;
    }

    setIsIssuing(true);
    setIssueSuccessMsg('');

    try {
      let checksum = generateRandomChecksum();
      if (selectedPDF) {
        const uploadRes = await uploadCertificatePDF(selectedPDF);
        checksum = uploadRes.checksum || uploadRes.sha256Hash;
      }

      const txHash = await issueCertificateOnChain(studentId, studentName, courseProgram, checksum);

      const newCert: Certificate = {
        id: studentId,
        recipientName: studentName,
        courseProgram: courseProgram,
        issueDate: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
        status: 'Valid',
        txHash: txHash,
        checksum: checksum,
        issuerName: 'Trường Đại học Stitch',
        issuerLogo: STITCH_UNIVERSITY_LOGO,
        timestamp: new Date().toUTCString(),
      };

      onAddCertificate(newCert);
      setIssueSuccessMsg(`Đã cấp phát thành công cho sinh viên ${studentName} trên Blockchain!`);
      setStudentId('');
      setStudentName('');
      setSelectedPDF(null);
      setTimeout(() => {
        setShowIssueModal(false);
        setIssueSuccessMsg('');
      }, 2500);
    } catch (err) {
      console.error('Lỗi cấp phát:', err);
    } finally {
      setIsIssuing(false);
    }
  };

  const handleRevoke = (certId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn thu hồi văn bằng với mã ${certId} trên mạng lưới?`)) {
      const updated = certificates.map((c) => (c.id === certId ? { ...c, status: 'Revoked' as const } : c));
      onUpdateCertificates(updated);
    }
  };

  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch =
      c.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseProgram.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCourse = courseFilter === 'ALL' || c.courseProgram === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleExportCSV = () => {
    const headers = ['Mã ID,Tên Sinh viên,Chương trình Đào tạo,Ngày cấp,Trạng thái,SHA256 Checksum,TxHash'];
    const rows = filteredCertificates.map(
      (c) =>
        `"${c.id}","${c.recipientName}","${c.courseProgram}","${c.issueDate}","${
          c.status === 'Valid' ? 'Hợp lệ' : 'Đã thu hồi'
        }","${c.checksum}","${c.txHash}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ChainVerify_QLVanBang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableColumns: Column<Certificate>[] = [
    {
      header: 'Mã ID',
      key: 'id',
      className: 'font-mono font-bold text-[#001e40]',
    },
    {
      header: 'Tên Sinh viên',
      key: 'recipientName',
      className: 'font-bold text-[#1a1c1f]',
    },
    {
      header: 'Chương trình Đào tạo',
      key: 'courseProgram',
    },
    {
      header: 'Ngày ban hành',
      key: 'issueDate',
      className: 'text-xs text-[#505f76]',
    },
    {
      header: 'Trạng thái',
      key: 'status',
      render: (item) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            item.status === 'Valid'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {item.status === 'Valid' ? 'Hợp lệ' : 'Đã thu hồi'}
        </span>
      ),
    },
    {
      header: 'SHA-256 Checksum',
      key: 'checksum',
      render: (item) => (
        <span className="font-mono text-[11px] text-[#505f76] truncate max-w-[130px] block" title={item.checksum}>
          {item.checksum.slice(0, 14)}...
        </span>
      ),
    },
    {
      header: 'Hành động',
      key: 'actions',
      render: (item) =>
        item.status === 'Valid' ? (
          <button
            onClick={() => handleRevoke(item.id)}
            className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Ban className="w-3 h-3" />
            <span>Thu hồi</span>
          </button>
        ) : (
          <span className="text-[11px] text-gray-400 font-semibold italic">Đã khóa</span>
        ),
    },
  ];

  return (
    <div className="w-full animate-fadeIn space-y-6 py-2">
      {/* Header & Actions Bar */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#001e40] flex items-center gap-2.5">
            <Award className="w-6 h-6 text-[#001e40]" />
            <span>Quản lý & Ban hành Văn bằng</span>
          </h1>
          <p className="font-sans text-xs text-[#505f76] mt-1">
            Tổng cộng <strong className="text-[#001e40]">{filteredCertificates.length}</strong> / {certificates.length} chứng chỉ học thuật.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowIssueModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ban hành mới</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-[#001e40] hover:bg-[#003366] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>

          <div className="flex bg-[#f4f3f8] p-1 rounded-xl border border-[#e0e2ec]">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'table' ? 'bg-white text-[#001e40] shadow-2xs' : 'text-[#737780]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bảng</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'grid' ? 'bg-white text-[#001e40] shadow-2xs' : 'text-[#737780]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lưới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-[#c3c6d1] shadow-2xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo Tên, ID, Ngành..."
            className="w-full pl-9 pr-3 py-2 bg-[#f9f9fe] border border-[#e0e2ec] rounded-lg text-xs outline-none focus:border-[#001e40]"
          />
          <Search className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f9f9fe] border border-[#e0e2ec] rounded-lg text-xs outline-none focus:border-[#001e40] cursor-pointer"
          >
            <option value="ALL">Tất cả Trạng thái</option>
            <option value="Valid">✔ Hợp lệ (Valid)</option>
            <option value="Revoked">✖ Đã thu hồi (Revoked)</option>
          </select>
          <Filter className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
        </div>

        <div className="relative">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f9f9fe] border border-[#e0e2ec] rounded-lg text-xs outline-none focus:border-[#001e40] cursor-pointer"
          >
            <option value="ALL">Tất cả Chương trình Đào tạo</option>
            <option value="Cử nhân Khoa học Máy tính">Cử nhân Khoa học Máy tính</option>
            <option value="Thạc sĩ Phân tích Dữ liệu">Thạc sĩ Phân tích Dữ liệu</option>
            <option value="Cử nhân Quản trị Kinh doanh">Cử nhân Quản trị Kinh doanh</option>
            <option value="Tiến sĩ Vật lý & Kỹ thuật">Tiến sĩ Vật lý & Kỹ thuật</option>
            <option value="Chứng chỉ Mật mã học & Blockchain">Chứng chỉ Mật mã học & Blockchain</option>
          </select>
          <Award className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Main Display Grid vs Table */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 shadow-xs">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => (
              <div key={cert.id} className="relative group">
                <CertificateCard certificate={cert} />
                {cert.status === 'Valid' && (
                  <button
                    onClick={() => handleRevoke(cert.id)}
                    className="absolute top-4 right-28 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Thu hồi</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Table<Certificate>
            columns={tableColumns}
            data={filteredCertificates}
            keyExtractor={(item) => item.id}
            emptyMessage="Không tìm thấy chứng chỉ nào khớp với bộ lọc hiện tại."
          />
        )}
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-[#001e40]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#c3c6d1] rounded-2xl p-8 shadow-xl max-w-xl w-full relative">
            <button
              onClick={() => setShowIssueModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#001e40] font-bold text-sm bg-gray-100 px-3 py-1 rounded-lg cursor-pointer"
            >
              ✕ Đóng
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#001e40] mb-2 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-emerald-600" />
              <span>Ban hành Văn bằng mới</span>
            </h2>
            <p className="text-xs text-[#505f76] mb-6">
              Mã băm SHA-256 của tệp tin PDF và chữ ký số sẽ được ghi trực tiếp lên Smart Contract Sepolia.
            </p>

            {issueSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{issueSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleIssueCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#001e40] uppercase mb-1">Mã số Sinh viên / ID *</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="VD: STU-2024-9901"
                  className="w-full px-4 py-2.5 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg text-sm font-mono outline-none focus:border-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001e40] uppercase mb-1">Họ và tên Sinh viên *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="VD: Nguyễn Văn An"
                  className="w-full px-4 py-2.5 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg text-sm outline-none focus:border-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001e40] uppercase mb-1">Chương trình Đào tạo</label>
                <select
                  value={courseProgram}
                  onChange={(e) => setCourseProgram(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg text-sm outline-none focus:border-[#001e40]"
                >
                  <option value="Cử nhân Khoa học Máy tính">Cử nhân Khoa học Máy tính</option>
                  <option value="Thạc sĩ Phân tích Dữ liệu">Thạc sĩ Phân tích Dữ liệu</option>
                  <option value="Cử nhân Quản trị Kinh doanh">Cử nhân Quản trị Kinh doanh</option>
                  <option value="Tiến sĩ Vật lý & Kỹ thuật">Tiến sĩ Vật lý & Kỹ thuật</option>
                  <option value="Chứng chỉ Mật mã học & Blockchain">Chứng chỉ Mật mã học & Blockchain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001e40] uppercase mb-1">Tệp tin PDF gốc (Băm SHA-256)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedPDF(e.target.files?.[0] || null)}
                  className="w-full text-xs text-[#505f76] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#001e40] file:text-white hover:file:bg-[#003366]"
                />
              </div>

              <button
                type="submit"
                disabled={isIssuing}
                className="w-full bg-[#001e40] hover:bg-[#003366] disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-6"
              >
                {isIssuing ? (
                  <span>Đang ghi nhận Smart Contract...</span>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    <span>Ký & Ban hành lên Blockchain</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
