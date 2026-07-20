import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import { QR_CODE_IMAGE } from '../data';

/**
 * [THANH - MODULE 17 TODO]: Component Sinh QR Code đính kèm vào file PDF chứng chỉ
 * - Tạo mã QR code chứa đường link xác minh trực tiếp trên hệ thống
 * - Người dùng có thể sao chép URL hoặc quét QR bằng camera điện thoại
 */

interface QRCodeGeneratorProps {
  certId: string;
  recipientName?: string;
}

export default function QRCodeGenerator({ certId, recipientName }: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const verifyUrl = `${window.location.origin}/verify?id=${encodeURIComponent(certId)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#f4f3f8] border border-[#c3c6d1] p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 max-w-md">
      <div className="w-24 h-24 bg-white p-2 rounded border border-[#c3c6d1] flex items-center justify-center shrink-0 shadow-xs">
        {/* Sử dụng QR image mẫu hoặc qrcode.react nếu tải thư viện */}
        <img src={QR_CODE_IMAGE} alt={`QR Code for ${certId}`} className="w-full h-full object-contain" />
      </div>

      <div className="flex-grow space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#001e40]">
          <QrCode className="w-4 h-4 text-[#001e40]" />
          <span>Mã tra cứu nhanh</span>
        </div>
        <p className="text-[11px] text-[#505f76] leading-tight break-all font-mono bg-white p-1.5 rounded border border-[#e0e2ec]">
          {verifyUrl}
        </p>
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <button
            onClick={handleCopyUrl}
            className="px-2.5 py-1 bg-[#001e40] hover:bg-[#003366] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép link' : 'Chép link tra cứu'}</span>
          </button>
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#001e40] border border-[#c3c6d1] rounded text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở</span>
          </a>
        </div>
      </div>
    </div>
  );
}
