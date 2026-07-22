import React, { useState } from 'react';
import { Users, Search, Mail, Phone, GraduationCap, ShieldCheck, CheckCircle2, Filter } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  major: string;
  gpa: number;
  walletAddress: string;
  status: 'Active' | 'Graduated';
  issuedCount: number;
}

const SAMPLE_STUDENTS: StudentData[] = [
  {
    id: 'STU-2024-8891',
    name: 'Alex Johnson',
    email: 'alex.johnson@student.stitch.edu',
    phone: '0988 123 456',
    major: 'Khoa học Máy tính',
    gpa: 3.85,
    walletAddress: '0x8f2a...d6f9',
    status: 'Graduated',
    issuedCount: 3,
  },
  {
    id: 'STU-2024-8892',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@student.stitch.edu',
    phone: '0988 234 567',
    major: 'Khoa học Máy tính',
    gpa: 3.92,
    walletAddress: '0x8f3c...a1b2',
    status: 'Graduated',
    issuedCount: 2,
  },
  {
    id: 'STU-2024-8893',
    name: 'James Chen',
    email: 'james.chen@student.stitch.edu',
    phone: '0988 345 678',
    major: 'Phân tích Dữ liệu',
    gpa: 3.78,
    walletAddress: '0x7e2d...a1bc',
    status: 'Graduated',
    issuedCount: 1,
  },
  {
    id: 'STU-2024-8894',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@student.stitch.edu',
    phone: '0988 456 789',
    major: 'Quản trị Kinh doanh',
    gpa: 3.65,
    walletAddress: '0x6d1c...a1de',
    status: 'Graduated',
    issuedCount: 1,
  },
  {
    id: 'STU-2024-8895',
    name: 'Michael Chang',
    email: 'michael.chang@student.stitch.edu',
    phone: '0988 567 890',
    major: 'Vật lý & Kỹ thuật',
    gpa: 3.95,
    walletAddress: '0x5c0a...a1ef',
    status: 'Active',
    issuedCount: 1,
  },
];

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [majorFilter, setMajorFilter] = useState('ALL');

  const filteredStudents = SAMPLE_STUDENTS.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMajor = majorFilter === 'ALL' || s.major === majorFilter;
    return matchesSearch && matchesMajor;
  });

  return (
    <div className="w-full animate-fadeIn space-y-6 py-2">
      {/* Header */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#001e40] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#001e40]" />
            <span>Quản lý Hồ sơ Sinh viên</span>
          </h1>
          <p className="font-sans text-xs text-[#505f76] mt-1">
            Theo dõi danh sách sinh viên đủ điều kiện cấp phát văn bằng và địa chỉ ví định danh Web3.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-[#f4f3f8] border border-[#e0e2ec] rounded-xl text-xs font-bold text-[#001e40] flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#001e40]" />
          <span>Tổng sinh viên: {SAMPLE_STUDENTS.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#c3c6d1] shadow-2xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo Tên, Mã SV hoặc Email..."
            className="w-full pl-9 pr-3 py-2 bg-[#f9f9fe] border border-[#e0e2ec] rounded-lg text-xs outline-none focus:border-[#001e40]"
          />
          <Search className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
        </div>

        <div className="relative">
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f9f9fe] border border-[#e0e2ec] rounded-lg text-xs outline-none focus:border-[#001e40] cursor-pointer"
          >
            <option value="ALL">Tất cả Ngành học</option>
            <option value="Khoa học Máy tính">Khoa học Máy tính</option>
            <option value="Phân tích Dữ liệu">Phân tích Dữ liệu</option>
            <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
            <option value="Vật lý & Kỹ thuật">Vật lý & Kỹ thuật</option>
          </select>
          <Filter className="w-4 h-4 text-[#737780] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#c3c6d1] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-[#f4f3f8] text-[#001e40] border-b border-[#c3c6d1]">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Mã SV</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Họ và Tên</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Ngành đào tạo</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">GPA</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Địa chỉ Ví Sepolia</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Văn bằng sở hữu</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f5]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#505f76]">
                    Không tìm thấy sinh viên khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-[#f9f9fe] transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#001e40]">{stu.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#1a1c1f]">{stu.name}</div>
                      <div className="text-[11px] text-[#737780] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{stu.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#505f76]">{stu.major}</td>
                    <td className="py-4 px-4 font-bold text-[#001e40]">{stu.gpa}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded font-mono text-[11px] font-bold flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>{stu.walletAddress}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#001e40]">{stu.issuedCount} văn bằng</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          stu.status === 'Graduated'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{stu.status === 'Graduated' ? 'Đã tốt nghiệp' : 'Đang theo học'}</span>
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
