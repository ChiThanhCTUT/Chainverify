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
  Share2,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { Certificate } from '../types';
import { STITCH_UNIVERSITY_LOGO } from '../data';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { verifyCertificateOnChain } from '../services/blockchainService';
import { calculateFileSHA256 } from '../utils/crypto';

/**
 * [THANH - MODULE 18 COMPLETED]: Trang Tra cứu & Xác minh Văn bằng (STT 33, 34, 35)
 * - STT 34: Xây dựng UI Trang tra cứu (/verify), khu vực kéo thả tệp tin PDF gốc mượt mà.
 * - STT 35: Tính toán mã băm SHA-256 trực tiếp từ file PDF tải lên bằng Web Crypto API và đối chiếu on-chain.
 * - STT 33: Tính năng chia sẻ link tra cứu nhanh (Web Share API hoặc Copy link gửi nhà tuyển dụng).
 */

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
  
  // Thông tin file PDF khi băm SHA-256
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [calculatedFileHash, setCalculatedFileHash] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

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
    setUploadedFileName('');
    setCalculatedFileHash('');

    try {
      // 1. Kiểm tra trong danh sách bộ nhớ tạm/state hiện tại
      const found = certificates.find(
        (c) =>
          c.id.toLowerCase() === trimmed.toLowerCase() ||
          c.checksum.toLowerCase() === trimmed.toLowerCase() ||
          c.txHash.toLowerCase() === trimmed.toLowerCase()
      );

      if (found) {
        setVerifiedCert(found);
      } else {
        // 2. Thử tra cứu trên mạng lưới Blockchain (Module 14 / 18 - blockchainService)
        const onChainCert = await verifyCertificateOnChain(trimmed);
        if (onChainCert) {
          setVerifiedCert({
            id: onChainCert.certId,
            recipientName: onChainCert.recipientName,
            courseProgram: onChainCert.courseProgram,
            issueDate: onChainCert.issueDate,
            status: onChainCert.isValid ? 'Valid' : 'Revoked',
            txHash: onChainCert.txHash || 'On-chain Smart Contract',
            checksum: onChainCert.checksum,
            issuerName: onChainCert.issuer || 'Trường Đại học Stitch',
            issuerLogo: STITCH_UNIVERSITY_LOGO,
            timestamp: new Date().toUTCString(),
          });
        } else {
          setErrorMsg(
            'Không tìm thấy văn bằng hoặc chữ ký mật mã không khớp. Vui lòng kiểm tra lại Mã ID, Checksum SHA-256 hoặc TxHash.'
          );
        }
      }
    } catch (err) {
      setErrorMsg('Đã xảy ra lỗi khi kết nối tới mạng lưới tra cứu. Vui lòng thử lại sau.');
    } finally {
      setIsAnalyzing(false);
    }
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

  // STT 34 & 35: Xử lý tệp tin PDF tải lên, tính toán SHA-256 thực tế trên trình duyệt
  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Vui lòng chỉ tải lên tệp tin định dạng PDF để kiểm tra chữ ký.');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setVerifiedCert(null);
    setUploadedFileName(file.name);
    setCalculatedFileHash('');

    try {
      // Tính toán mã băm SHA-256 thực sự bằng Web Crypto API
      const realSha256 = await calculateFileSHA256(file);
      setCalculatedFileHash(realSha256);

      // Đối chiếu mã băm thực tế vừa tính toán với danh sách hoặc on-chain
      const match = certificates.find(
        (c) => c.checksum.toLowerCase() === realSha256.toLowerCase()
      );

      if (match) {
        setVerifiedCert(match);
      } else {
        // Kiểm tra thử trên blockchainService bằng mã băm vừa tính
        const onChainMatch = await verifyCertificateOnChain(realSha256);
        if (onChainMatch) {
          setVerifiedCert({
            id: onChainMatch.certId,
            recipientName: onChainChainMatch(onChainMatch),
            courseProgram: onChainMatch.courseProgram,
            issueDate: onChainMatch.issueDate,
            status: onChainMatch.isValid ? 'Valid' : 'Revoked',
            txHash: onChainMatch.txHash || 'On-chain Smart Contract',
            checksum: onChainMatch.checksum,
            issuerName: onChainMatch.issuer || 'Trường Đại học Stitch',
            issuerLogo: STITCH_UNIVERSITY_LOGO,
            timestamp: new Date().toUTCString(),
          });
        } else {
          // Nếu không khớp mã hash thực, nhưng trong chế độ test ta cho phép fallback tra cứu ID
          setErrorMsg(
            `Tệp tin "${file.name}" sinh ra mã băm SHA-256: [${realSha256.slice(0, 16)}...]. Mã băm này chưa được đăng ký trên mạng lưới Blockchain.`
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi đọc và băm tệp tin PDF tải lên.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onChainChainMatch = (cert: any) => cert.recipientName;

  // STT 33: Tính năng chia sẻ link tra cứu qua Web Share API hoặc Copy cho nhà tuyển dụng
  const handleShareCert = (certId: string) => {
    const url = `${window.location.origin}/verify?id=${encodeURIComponent(certId)}`;
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      (navigator as any)
        .share({
          title: `Xác minh văn bằng học thuật - ${certId}`,
          text: `Tra cứu tính hợp lệ và chữ ký Blockchain của văn bằng ${certId} trên hệ thống ChainVerify.`,
          url: url,
        })
        .catch(() => {
          navigator.clipboard.writeText(url);
          showShareToast();
        });
    } else {
      navigator.clipboard.writeText(url);
      showShareToast();
    }
  };

  const showShareToast = () => {
    setShareFeedback('Đã chép đường link tra cứu vào bộ nhớ tạm để gửi cho nhà tuyển dụng!');
    setTimeout(() => setShareFeedback(''), 3000);
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-[#001e40] font-bold mb-3">
          Cổng Tra cứu & Xác minh Chứng chỉ
        </h1>
        <p className="font-sans text-sm md:text-base text-[#505f76] leading-relaxed">
          Tra cứu tức thời tính nguyên vẹn và xác thực của văn bằng học thuật bằng ID, mã SHA-256 Checksum, hoặc kéo thả tệp tin PDF gốc để tính toán mã băm on-chain.
        </p>
      </div>

      {/* Thông báo chia sẻ STT 33 */}
      {shareFeedback && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs font-semibold flex items-center justify-center gap-2 animate-bounce">
          <Share2 className="w-4 h-4 text-blue-600" />
          <span>{shareFeedback}</span>
        </div>
      )}

      {/* STT 34: Input Tra cứu & Khu vực Kéo thả PDF */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs max-w-3xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchId)}
              placeholder="Nhập ID (VD: STU-992), Checksum SHA-256 hoặc TxHash..."
              className="w-full pl-4 pr-10 py-3.5 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg font-mono text-sm focus:outline-none focus:border-[#001e40] transition-colors"
            />
            {searchId && (
              <button
                onClick={() => setSearchId('')}
                className="absolute right-3.5 top-3.5 text-[#737780] hover:text-[#1a1c1f] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch(searchId)}
            disabled={isAnalyzing || !searchId.trim()}
            className="bg-[#001e40] hover:bg-[#003366] disabled:opacity-50 text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs active:scale-[0.98]"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang băm & kiểm tra...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Xác minh ngay</span>
              </>
            )}
          </button>
        </div>

        {/* Khu vực Kéo thả PDF chuẩn mực STT 34 */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#001e40] bg-[#e6f0ff] scale-[0.99]'
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
          <UploadCloud className="w-10 h-10 text-[#001e40] mx-auto mb-3 opacity-85" />
          <p className="text-sm font-bold text-[#001e40]">
            Kéo thả tệp tin PDF gốc vào đây, hoặc nhấn để chọn từ máy tính
          </p>
          <p className="text-xs text-[#505f76] mt-1.5 max-w-lg mx-auto">
            Hệ thống áp dụng thuật toán <strong className="text-[#001e40]">SHA-256</strong> tính toán mã băm ngay tại trình duyệt client, tuyệt đối không tải file ra bên ngoài để bảo mật riêng tư.
          </p>
        </div>

        {/* Hiển thị mã băm SHA-256 thực tế vừa tính toán STT 35 */}
        {uploadedFileName && calculatedFileHash && (
          <div className="mt-6 p-4 bg-[#f4f3f8] border border-[#e0e2ec] rounded-lg text-xs font-mono space-y-1 animate-fadeIn">
            <div className="flex items-center justify-between text-[#505f76] pb-1 border-b border-[#e0e2ec]">
              <span className="font-sans font-bold flex items-center gap-1.5 text-[#001e40]">
                <FileText className="w-4 h-4" />
                <span>Tệp tin đã băm: {uploadedFileName}</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(calculatedFileHash);
                  setCopiedHash(true);
                  setTimeout(() => setCopiedHash(false), 2000);
                }}
                className="px-2 py-1 bg-white hover:bg-gray-200 text-[#001e40] rounded border border-[#c3c6d1] flex items-center gap-1 cursor-pointer font-sans"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Đã chép mã băm' : 'Chép mã băm'}</span>
              </button>
            </div>
            <div className="pt-1.5 text-[#001e40] break-all font-bold">
              SHA-256: {calculatedFileHash}
            </div>
          </div>
        )}
      </div>

      {/* Thông báo lỗi */}
      {errorMsg && (
        <div className="max-w-3xl mx-auto p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3.5 text-red-800 text-sm mb-8 animate-fadeIn shadow-2xs">
          <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Kết quả kiểm tra không khớp:</p>
            <p className="leading-relaxed opacity-90">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Kết quả xác minh thành công */}
      {verifiedCert && (
        <div className="max-w-3xl mx-auto bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-sm animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#f0f1f5] pb-6 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  {verifiedCert.status === 'Valid' ? 'CHỨNG CHỈ HỢP LỆ (VERIFIED ON-CHAIN)' : 'ĐÃ BỊ THU HỒI'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#001e40] mt-1.5">
                  {verifiedCert.courseProgram}
                </h3>
              </div>
            </div>

            {/* STT 33: Nút chia sẻ nhanh sang nhà tuyển dụng */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleShareCert(verifiedCert.id)}
                className="w-full sm:w-auto px-4 py-2 bg-[#f4f3f8] hover:bg-[#e0e2ec] text-[#001e40] border border-[#c3c6d1] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ chứng chỉ</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm mb-6 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-[#505f76]">
                <User className="w-4 h-4 text-[#001e40]" />
                <span>Sinh viên sở hữu:</span>
              </div>
              <p className="font-bold text-[#001e40] text-lg pl-6.5">{verifiedCert.recipientName}</p>

              <div className="flex items-center gap-2.5 text-[#505f76] pt-2">
                <Landmark className="w-4 h-4 text-[#001e40]" />
                <span>Tổ chức cấp phát:</span>
              </div>
              <p className="font-bold text-[#001e40] text-lg pl-6.5">{verifiedCert.issuerName}</p>

              <div className="pt-2 pl-6.5 text-xs text-[#737780]">
                Ban hành ngày: <strong className="text-[#001e40]">{verifiedCert.issueDate}</strong>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <QRCodeGenerator certId={verifiedCert.id} recipientName={verifiedCert.recipientName} />
            </div>
          </div>

          {/* Cụm thông tin mật mã Checksum & TxHash */}
          <div className="bg-[#f9f9fe] p-4.5 rounded-xl border border-[#e0e2ec] space-y-3 text-xs font-mono mb-4">
            <div>
              <span className="text-[#737780] block text-[11px] uppercase tracking-wider font-sans font-bold">Mã định danh ID:</span>
              <span className="font-bold text-[#001e40] text-sm">{verifiedCert.id}</span>
            </div>
            <div>
              <span className="text-[#737780] block text-[11px] uppercase tracking-wider font-sans font-bold">SHA-256 Checksum (Mã băm PDF):</span>
              <span className="text-[#001e40] break-all font-semibold">{verifiedCert.checksum}</span>
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
              <span>Kiểm tra Giao dịch trên Etherscan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
