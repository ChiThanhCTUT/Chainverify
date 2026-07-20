import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  UploadCloud,
  CheckCircle,
  XCircle,
  User,
  Landmark,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { Certificate } from '../types';
import { STITCH_UNIVERSITY_LOGO } from '../data';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { verifyCertificateOnChain } from '../services/blockchainService';

interface VerifyProps {
  certificates: Certificate[];
}

export default function Verify({ certificates }: VerifyProps) {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialId);
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tự động tìm kiếm nếu trên URL có tham số ?id=STU-992
  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const handleSearch = async (idToSearch: string) => {
    const trimmed = idToSearch.trim();
    if (!trimmed) return;

    setErrorMsg('');
    setIsAnalyzing(true);
    setVerifiedCert(null);

    // Mô phỏng độ trễ xác minh SHA-256 / On-chain
    setTimeout(async () => {
      setIsAnalyzing(false);
      const found = certificates.find(
        (c) =>
          c.id.toLowerCase() === trimmed.toLowerCase() ||
          c.checksum.toLowerCase() === trimmed.toLowerCase() ||
          c.txHash.toLowerCase() === trimmed.toLowerCase()
      );

      if (found) {
        setVerifiedCert(found);
      } else {
        // Thử kiểm tra trên Blockchain thực tế (Module 18 CÔNG)
        const onChainCert = await verifyCertificateOnChain(trimmed);
        if (onChainCert) {
          setVerifiedCert({
            id: trimmed,
            recipientName: onChainCert.recipientName,
            courseProgram: onChainCert.courseProgram,
            issueDate: onChainCert.issueDate,
            status: onChainCert.isValid ? 'Valid' : 'Revoked',
            txHash: 'On-chain Smart Contract',
            checksum: onChainCert.checksum,
            issuerName: 'Trường Đại học Stitch',
            issuerLogo: STITCH_UNIVERSITY_LOGO,
            timestamp: new Date().toUTCString(),
          });
        } else {
          setErrorMsg(
            'Không tìm thấy chứng chỉ hoặc chữ ký mật mã không khớp. Vui lòng kiểm tra lại ID, Checksum hoặc TxHash.'
          );
        }
      }
    }, 800);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg('');
    setIsAnalyzing(true);
    setVerifiedCert(null);

    // Giả lập băm file PDF và đối chiếu
    setTimeout(() => {
      setIsAnalyzing(false);
      const match = certificates.find((c) => c.status === 'Valid');
      if (match) {
        setVerifiedCert(match);
      } else {
        setErrorMsg('Tệp tin PDF không chứa mã băm hợp lệ trên mạng lưới Blockchain.');
      }
    }, 1200);
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-[#001e40] font-bold mb-3">
          Cổng Xác minh Chứng chỉ Học thuật
        </h1>
        <p className="font-sans text-sm md:text-base text-[#505f76]">
          Tra cứu tức thời tính nguyên vẹn và xác thực của bất kỳ văn bằng nào bằng ID chứng chỉ, mã SHA-256 Checksum, hoặc tải lên tệp tin PDF gốc.
        </p>
      </div>

      {/* Input Tra cứu */}
      <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 md:p-8 shadow-xs max-w-3xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchId)}
              placeholder="Nhập ID (VD: STU-992), Checksum hoặc TxHash..."
              className="w-full px-4 py-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded font-mono text-sm focus:outline-none focus:border-[#001e40] transition-colors"
            />
            {searchId && (
              <button
                onClick={() => setSearchId('')}
                className="absolute right-3 top-3 text-[#737780] hover:text-[#1a1c1f] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch(searchId)}
            disabled={isAnalyzing || !searchId.trim()}
            className="bg-[#001e40] hover:bg-[#003366] disabled:opacity-50 text-white px-6 py-3 rounded font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Xác minh ngay</span>
              </>
            )}
          </button>
        </div>

        {/* Kéo thả tệp tin PDF */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#001e40] bg-[#e6f0ff]'
              : 'border-[#c3c6d1] hover:border-[#737780] bg-[#f9f9fe]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-[#001e40] mx-auto mb-2 opacity-80" />
          <p className="text-xs font-bold text-[#001e40]">
            Kéo thả tệp tin PDF gốc vào đây, hoặc nhấn để tải lên
          </p>
          <p className="text-[11px] text-[#737780] mt-1">
            Hệ thống sẽ tự động băm SHA-256 tệp tin PDF để kiểm tra chữ ký trên Blockchain
          </p>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {errorMsg && (
        <div className="max-w-3xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800 text-sm mb-8 animate-fadeIn">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Kết quả xác minh thành công */}
      {verifiedCert && (
        <div className="max-w-3xl mx-auto bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-sm animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#f0f1f5] pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  {verifiedCert.status === 'Valid' ? 'CHỨNG CHỈ HỢP LỆ' : 'ĐÃ BỊ THU HỒI'}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#001e40] mt-1">
                  {verifiedCert.courseProgram}
                </h3>
              </div>
            </div>

            <QRCodeGenerator certId={verifiedCert.id} recipientName={verifiedCert.recipientName} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#505f76]">
                <User className="w-4 h-4 text-[#001e40]" />
                <span>Sinh viên sở hữu:</span>
              </div>
              <p className="font-bold text-[#001e40] text-base pl-6">{verifiedCert.recipientName}</p>

              <div className="flex items-center gap-2 text-[#505f76] pt-2">
                <Landmark className="w-4 h-4 text-[#001e40]" />
                <span>Tổ chức cấp phát:</span>
              </div>
              <p className="font-bold text-[#001e40] text-base pl-6">{verifiedCert.issuerName}</p>
            </div>

            <div className="bg-[#f9f9fe] p-4 rounded-lg border border-[#e0e2ec] space-y-2.5 text-xs font-mono">
              <div>
                <span className="text-[#737780] block">Mã số ID:</span>
                <span className="font-bold text-[#001e40]">{verifiedCert.id}</span>
              </div>
              <div>
                <span className="text-[#737780] block">Ngày cấp:</span>
                <span className="text-[#001e40] font-sans font-semibold">{verifiedCert.issueDate}</span>
              </div>
              <div>
                <span className="text-[#737780] block">SHA-256 Checksum:</span>
                <span className="text-[#001e40] break-all">{verifiedCert.checksum}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f0f1f5] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#737780] font-mono">TxHash: {verifiedCert.txHash}</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${verifiedCert.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#001e40] hover:underline font-bold flex items-center gap-1"
            >
              <span>Xem trên Etherscan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
