import React, { useState } from 'react';
import { FileText, Search, ShieldCheck, Clock, CheckCircle2, Ban, UserCheck, Filter } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: 'ISSUE_CERTIFICATE' | 'REVOKE_CERTIFICATE' | 'VERIFY_CHECKSUM' | 'SYSTEM_SYNC';
  targetId: string;
  details: string;
  status: 'SUCCESS' | 'WARNING';
}

const SAMPLE_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-8801',
    timestamp: '2026-07-22 14:15:22 GMT+7',
    actor: 'TS. Eleanor Vance (0x54ce...33e8)',
    action: 'ISSUE_CERTIFICATE',
    targetId: 'STU-2024-8891',
    details: 'Ban hành văn bằng Cử nhân Khoa học Máy tính cho Alex Johnson. SHA256: 8f2ad...9c10',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-8802',
    timestamp: '2026-07-22 13:40:10 GMT+7',
    actor: 'System Auto-Verifier',
    action: 'VERIFY_CHECKSUM',
    targetId: 'STU-MCS24',
    details: 'Đối chiếu thành công mã băm PDF với Smart Contract trên Sepolia Testnet.',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-8803',
    timestamp: '2026-07-21 16:20:05 GMT+7',
    actor: 'TS. Eleanor Vance (0x54ce...33e8)',
    action: 'ISSUE_CERTIFICATE',
    targetId: 'STU-ACR23',
    details: 'Ban hành chứng chỉ Thạc sĩ Phân tích Dữ liệu cho Elena Rodriguez. TxHash: 0x9a8b...7c6d',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-8804',
    timestamp: '2026-07-20 09:12:44 GMT+7',
    actor: 'TS. Eleanor Vance (0x54ce...33e8)',
    action: 'REVOKE_CERTIFICATE',
    targetId: 'STU-OLD-1998',
    details: 'Thu hồi chứng chỉ cũ do phát hiện sai lệch thông tin hồ sơ gốc. TxHash: 0x1122...3344',
    status: 'WARNING',
  },
  {
    id: 'LOG-8805',
    timestamp: '2026-07-19 11:05:18 GMT+7',
    actor: 'Database Synchronizer (Port 5000)',
    action: 'SYSTEM_SYNC',
    targetId: 'ALL_TABLES',
    details: 'Đồng bộ cấu trúc dữ liệu MySQL Aiven Cloud SSL với bộ nhớ đệm frontend.',
    status: 'SUCCESS',
  },
];

export default function AdminAuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = SAMPLE_LOGS.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="w-full animate-fadeIn space-y-6 py-2">
      {/* Header */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#001e40] flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#001e40]" />
            <span>Nhật ký Kiểm tra & Báo cáo Bất biến (Audit Logs)</span>
          </h1>
          <p className="font-sans text-xs text-[#505f76] mt-1">
            Ghi nhận toàn bộ các thao tác nghiệp vụ, ban hành, thu hồi và truy vấn trên hệ thống ChainVerify.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Ghi nhận thời gian thực</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#c3c6d1] shadow-2xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Người thực hiện, ID văn bằng hoặc nội dung..."
            className="w-full pl-9 pr-3 py-2 bg-[#f9f9fe] border border-[#e0e2ec] rounded-lg text-xs outline-none focus:border-[#001e40]"
          />
          <Search className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
        </div>

        <div className="relative">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f9f9fe] border border-[#e0e2ec] rounded-lg text-xs outline-none focus:border-[#001e40] cursor-pointer"
          >
            <option value="ALL">Tất cả Loại hành động</option>
            <option value="ISSUE_CERTIFICATE">Ban hành Văn bằng</option>
            <option value="REVOKE_CERTIFICATE">Thu hồi Văn bằng</option>
            <option value="VERIFY_CHECKSUM">Xác thực Checksum</option>
            <option value="SYSTEM_SYNC">Đồng bộ Hệ thống</option>
          </select>
          <Filter className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-[#f4f3f8] text-[#001e40] border-b border-[#c3c6d1]">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Thời gian</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Người thực hiện / Actor</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Hành động</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Đối tượng</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Mô tả chi tiết</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f5]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#505f76]">
                    Không tìm thấy bản ghi nhật ký nào.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f9f9fe] transition-colors">
                    <td className="py-4 px-4 font-mono text-[#505f76] whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-4 px-4 font-bold text-[#001e40]">{log.actor}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                          log.action === 'ISSUE_CERTIFICATE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : log.action === 'REVOKE_CERTIFICATE'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-[#1a1c1f]">{log.targetId}</td>
                    <td className="py-4 px-4 text-[#505f76] leading-relaxed max-w-md">{log.details}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status === 'SUCCESS' ? 'Thành công' : 'Cảnh báo'}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
