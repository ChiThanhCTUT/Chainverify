import React, { useState } from 'react';
import { Settings as SettingsIcon, School, ShieldCheck, Database, Key, Save, CheckCircle2 } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../../contracts/config';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [institutionName, setInstitutionName] = useState('Trường Đại học Kĩ thuật - Công nghệ Cần Thơ (Can Tho University of Technology)');
  const [institutionCode, setInstitutionCode] = useState('CTUT-EDU-VN');
  const [issuerWallet, setIssuerWallet] = useState(CONTRACT_ADDRESS || '0x54ce6bc13beeaedec4cbb5558133efb1c0bf33e8');
  const [apiEndpoint, setApiEndpoint] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full animate-fadeIn max-w-4xl mx-auto py-2 space-y-8">
      {/* Header */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#001e40] flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-[#001e40]" />
            <span>Cấu hình Hệ thống & Tổ chức Cấp phát</span>
          </h1>
          <p className="font-sans text-xs text-[#505f76] mt-1">
            Điều chỉnh thông tin định danh nhà trường, kết nối Backend MySQL và tham số Ethereum Sepolia.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Đã cập nhật cấu hình hệ thống thành công! Các thay đổi đã có hiệu lực trên toàn bộ ứng dụng.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-2xs space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#001e40] border-b border-[#f0f1f5] pb-3 flex items-center gap-2">
            <School className="w-5 h-5 text-[#001e40]" />
            <span>Thông tin Tổ chức Cấp phát (Issuer Profile)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans text-sm">
            <div>
              <label className="block text-xs font-bold text-[#001e40] uppercase mb-1.5">Tên Đơn vị Ban hành *</label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full p-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg outline-none focus:border-[#001e40] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001e40] uppercase mb-1.5">Mã định danh Học hiệu *</label>
              <input
                type="text"
                value={institutionCode}
                onChange={(e) => setInstitutionCode(e.target.value)}
                className="w-full p-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg outline-none focus:border-[#001e40] text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-2xs space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#001e40] border-b border-[#f0f1f5] pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#001e40]" />
            <span>Cấu hình Kết nối Mạng lưới & API</span>
          </h3>

          <div className="space-y-5 font-sans text-sm">
            <div>
              <label className="block text-xs font-bold text-[#001e40] uppercase mb-1.5">
                Địa chỉ Smart Contract (Ethereum Sepolia)
              </label>
              <input
                type="text"
                value={issuerWallet}
                onChange={(e) => setIssuerWallet(e.target.value)}
                className="w-full p-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg outline-none focus:border-[#001e40] text-sm font-mono text-[#001e40] font-bold"
              />
              <span className="text-[11px] text-[#737780] block mt-1">
                Địa chỉ contract quản lý sổ cái chữ ký số trên mạng thử nghiệm Sepolia.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#001e40] uppercase mb-1.5">
                Backend API Endpoint (MySQL Database)
              </label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full p-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg outline-none focus:border-[#001e40] text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#001e40] hover:bg-[#003366] text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu cấu hình hệ thống</span>
          </button>
        </div>
      </form>
    </div>
  );
}
