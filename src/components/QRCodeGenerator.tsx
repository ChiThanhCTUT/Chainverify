import React, { useState, useRef } from 'react';
import { QrCode, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

/**
 * [THANH - MODULE 17 COMPLETED]: Component Sinh QR Code Động (STT 32, 33)
 * - Tự động sinh mã QR thực sự (Canvas/SVG) theo đường dẫn tra cứu chứng chỉ: /verify?id=XXX
 * - Hỗ trợ sao chép URL nhanh, mở trang trực tiếp và tải ảnh mã QR (PNG) chất lượng cao.
 */

interface QRCodeGeneratorProps {
  certId: string;
  recipientName?: string;
}

export default function QRCodeGenerator({ certId, recipientName }: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Đường dẫn tra cứu tuyệt đối động theo ID chứng chỉ
  const verifyUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/verify?id=${encodeURIComponent(certId)}`
      : `https://chainverify.edu.vn/verify?id=${encodeURIComponent(certId)}`;

  // STT 33: Tính năng sao chép link tra cứu
  const handleCopyUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // STT 32 & 33: Tính năng tải xuống ảnh QR PNG để in hoặc đính kèm PDF
  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `ChainVerify_QR_${certId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="bg-[#f4f3f8] border border-[#c3c6d1] p-4 rounded-xl flex flex-col sm:flex-row items-center gap-5 max-w-lg shadow-xs animate-fadeIn">
      {/* Khung hiển thị QR Code động thật 100% bằng QRCodeCanvas */}
      <div
        ref={qrRef}
        className="w-28 h-28 bg-white p-2.5 rounded-lg border border-[#c3c6d1] flex items-center justify-center shrink-0 shadow-sm relative group"
        title="Quét bằng camera điện thoại để tra cứu ngay"
      >
        <QRCodeCanvas
          value={verifyUrl}
          size={96}
          level="H"
          includeMargin={false}
          fgColor="#001e40"
          bgColor="#ffffff"
        />
      </div>

      <div className="flex-grow space-y-2.5 text-center sm:text-left w-full">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#001e40]">
          <QrCode className="w-4 h-4 text-[#001e40] shrink-0" />
          <span>Mã QR Tra Cứu Động</span>
          {recipientName && (
            <span className="text-[11px] font-normal text-[#505f76]">({recipientName})</span>
          )}
        </div>

        <p className="text-[11px] text-[#505f76] leading-relaxed break-all font-mono bg-white px-2 py-1.5 rounded border border-[#e0e2ec] shadow-2xs">
          {verifyUrl}
        </p>

        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-0.5">
          {/* Nút 1: Chép link tra cứu */}
          <button
            onClick={handleCopyUrl}
            className="px-2.5 py-1.5 bg-[#001e40] hover:bg-[#003366] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép link' : 'Chép link'}</span>
          </button>

          {/* Nút 2: Tải ảnh QR PNG */}
          <button
            onClick={handleDownloadQR}
            className="px-2.5 py-1.5 bg-white hover:bg-[#e6f0ff] text-[#001e40] border border-[#001e40] rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="Tải ảnh QR về máy để đính kèm PDF"
          >
            {downloaded ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{downloaded ? 'Đã tải QR' : 'Tải QR (PNG)'}</span>
          </button>

          {/* Nút 3: Mở trực tiếp */}
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-[#505f76] hover:text-[#001e40] border border-[#c3c6d1] rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Mở tab mới sang trang tra cứu"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở</span>
          </a>
        </div>
      </div>
    </div>
  );
}
