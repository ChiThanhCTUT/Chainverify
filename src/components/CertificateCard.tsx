import React from 'react';
import { Award, CheckCircle, ShieldAlert, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';
import { truncateHash } from '../utils/formatters';

interface CertificateCardProps {
  key?: React.Key;
  certificate: Certificate;
  onSelect?: (cert: Certificate) => void;
  showActions?: boolean;
}

export default function CertificateCard({ certificate, onSelect, showActions = true }: CertificateCardProps) {
  const isValid = certificate.status === 'Valid';

  return (
    <div
      onClick={() => onSelect && onSelect(certificate)}
      className={`bg-white border rounded-xl p-6 transition-all duration-200 ${
        onSelect ? 'cursor-pointer hover:shadow-md hover:border-[#001e40]' : ''
      } ${isValid ? 'border-[#c3c6d1]' : 'border-red-200 bg-red-50/20'}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={certificate.issuerLogo}
            alt={certificate.issuerName}
            className="w-12 h-12 rounded-full object-cover border border-[#e0e2ec] p-0.5 bg-white"
          />
          <div>
            <h4 className="font-sans font-bold text-base text-[#001e40]">{certificate.courseProgram}</h4>
            <p className="text-xs text-[#505f76]">{certificate.issuerName}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
            isValid
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {isValid ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldAlert className="w-3.5 h-3.5 text-red-600" />}
          {isValid ? 'Hợp lệ' : 'Đã thu hồi'}
        </span>
      </div>

      <div className="space-y-2 border-t border-[#f0f1f5] pt-4 text-xs font-sans text-[#505f76]">
        <div className="flex justify-between">
          <span>Người sở hữu:</span>
          <span className="font-bold text-[#001e40]">{certificate.recipientName}</span>
        </div>
        <div className="flex justify-between">
          <span>Mã số văn bằng:</span>
          <span className="font-mono font-bold text-[#001e40]">{certificate.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Ngày cấp phát:</span>
          <span>{certificate.issueDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Tx Hash:</span>
          <span className="font-mono text-[11px] text-[#001e40] bg-[#f4f3f8] px-2 py-0.5 rounded">
            {truncateHash(certificate.txHash, 10, 8)}
          </span>
        </div>
      </div>
    </div>
  );
}
