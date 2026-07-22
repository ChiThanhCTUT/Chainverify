import React, { useState } from 'react';
import { Award, Search, Check, Copy, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { Certificate } from '../../types';
import CertificateCard from '../../components/CertificateCard';
import QRCodeGenerator from '../../components/QRCodeGenerator';

interface StudentCertificatesProps {
  certificates: Certificate[];
}

export default function StudentCertificates({ certificates }: StudentCertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Valid'>('ALL');
  const [copiedChecksum, setCopiedChecksum] = useState(false);
  const [simulatedAction, setSimulatedAction] = useState('');

  const studentCerts = certificates.filter((c) => {
    const matchesSearch =
      c.courseProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChecksum(true);
    setTimeout(() => setCopiedChecksum(false), 2000);
  };

  const handleDownloadPDF = (cert: Certificate) => {
    setSimulatedAction('Đang tạo tệp tin PDF gốc kèm chữ ký Blockchain...');
    setTimeout(() => {
      setSimulatedAction(`Đã tải xuống thành công: Certificate_${cert.id}.pdf`);
      setTimeout(() => setSimulatedAction(''), 3500);
    }, 1000);
  };

  return (
    <div className="w-full animate-fadeIn space-y-6 py-2">
      {simulatedAction && (
        <div className="fixed top-20 right-6 bg-[#001e40] text-white px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3 text-xs font-semibold animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{simulatedAction}</span>
        </div>
      )}

      {/* Header & Search */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#001e40] flex items-center gap-2.5">
            <Award className="w-6 h-6 text-[#001e40]" />
            <span>Kho Văn bằng & Chứng chỉ của tôi</span>
          </h1>
          <p className="font-sans text-xs text-[#505f76] mt-1">
            Quản lý, tra cứu và tải xuống bản trích lục tài liệu xác minh chữ ký số SHA-256.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo ID hoặc tên văn bằng..."
            className="w-full pl-9 pr-3 py-2 bg-[#f9f9fe] border border-[#c3c6d1] rounded-xl text-xs outline-none focus:border-[#001e40] transition-colors"
          />
          <Search className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid */}
      {studentCerts.length === 0 ? (
        <div className="bg-white border border-[#c3c6d1] rounded-2xl p-12 text-center text-[#505f76] text-sm">
          Không tìm thấy văn bằng nào khớp với điều kiện tìm kiếm.
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

      {/* Modal / Detail Section */}
      {selectedCert && (
        <div className="bg-white border-2 border-[#001e40] rounded-2xl p-6 md:p-8 mt-8 shadow-lg animate-fadeIn">
          <div className="flex justify-between items-start mb-6 border-b border-[#f0f1f5] pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#001e40]">
                Chi tiết Văn bằng: {selectedCert.courseProgram}
              </h3>
              <p className="text-xs text-[#505f76] mt-1">Mã định danh: {selectedCert.id}</p>
            </div>
            <button
              onClick={() => setSelectedCert(null)}
              className="text-[#737780] hover:text-[#001e40] font-bold text-sm bg-[#f4f3f8] px-3 py-1 rounded-lg cursor-pointer transition-colors"
            >
              ✕ Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-6">
            <div className="space-y-4 text-sm font-sans">
              <div className="flex justify-between border-b border-[#f0f1f5] pb-2">
                <span className="text-[#505f76]">Người sở hữu:</span>
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
                <span className="text-xs text-[#737780] block mb-1">SHA-256 Cryptographic Checksum:</span>
                <div className="flex items-center gap-2 bg-[#f9f9fe] p-2.5 rounded-lg border border-[#e0e2ec] font-mono text-xs break-all">
                  <span className="flex-grow">{selectedCert.checksum}</span>
                  <button
                    onClick={() => handleCopyText(selectedCert.checksum)}
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
              className="bg-[#001e40] hover:bg-[#003366] text-white px-6 py-2.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải bản gốc PDF (kèm chữ ký Blockchain)</span>
            </button>

            {selectedCert.txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${selectedCert.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#001e40] hover:underline flex items-center gap-1"
              >
                <span>Tra cứu giao dịch trên Etherscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
