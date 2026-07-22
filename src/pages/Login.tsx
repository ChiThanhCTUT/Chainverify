import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ShieldCheck, ArrowRight, GraduationCap, Building2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isConnected, account, connectWallet, error, loginAs, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role: 'student' | 'admin') => {
    loginAs(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-8 md:p-10 bg-white border border-[#c3c6d1] rounded-2xl shadow-sm animate-fadeIn">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#001e40] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Wallet className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#001e40] mb-2">
          Cổng Xác thực Danh tính Web3
        </h1>
        <p className="font-sans text-sm text-[#505f76] max-w-md mx-auto leading-relaxed">
          Đăng nhập an toàn bằng chữ ký số MetaMask để truy cập các tính năng quản lý văn bằng, tra cứu và phát hành trên nền tảng Blockchain.
        </p>
      </div>

      {isConnected && account ? (
        <div className="space-y-6 font-sans">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-900 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-emerald-700">Ví đã kết nối thành công:</span>
                <span className="font-mono font-bold text-xs">{account}</span>
              </div>
            </div>
            <span className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px] uppercase">
              Sepolia
            </span>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold text-[#001e40] mb-3 text-center">
              Chọn vai trò truy cập phiên làm việc:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => handleSelectRole('student')}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  userRole === 'student'
                    ? 'border-[#001e40] bg-[#f4f3f8]'
                    : 'border-[#c3c6d1] bg-white hover:border-[#001e40]/40'
                }`}
              >
                <div>
                  <div className="w-10 h-10 bg-blue-50 text-[#001e40] rounded-lg flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#001e40] mb-1">Cổng Sinh viên</h4>
                  <p className="text-xs text-[#505f76] leading-relaxed">
                    Xem danh sách văn bằng đã được cấp cho hồ sơ của bạn, tải về bản gốc PDF và trích lục hồ sơ cá nhân.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e0e2ec] flex items-center justify-between text-xs font-bold text-[#001e40]">
                  <span>Vào khu vực Sinh viên</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div
                onClick={() => handleSelectRole('admin')}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  userRole === 'admin'
                    ? 'border-[#001e40] bg-[#001e40] text-white'
                    : 'border-[#001e40] bg-[#001e40]/5 hover:bg-[#001e40]/10'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${userRole === 'admin' ? 'bg-white/10 text-white' : 'bg-[#001e40] text-white'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className={`font-bold text-sm mb-1 ${userRole === 'admin' ? 'text-white' : 'text-[#001e40]'}`}>
                    Cổng Quản trị viên
                  </h4>
                  <p className={`text-xs leading-relaxed ${userRole === 'admin' ? 'text-gray-200' : 'text-[#505f76]'}`}>
                    Phát hành, băm SHA-256 chứng chỉ mới lên Smart Contract, quản lý danh sách sinh viên và thu hồi văn bằng.
                  </p>
                </div>
                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${userRole === 'admin' ? 'border-white/20 text-white' : 'border-[#001e40]/20 text-[#001e40]'}`}>
                  <span>Vào khu vực Quản trị</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={connectWallet}
            className="w-full bg-[#001e40] hover:bg-[#003366] text-white py-4 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <Wallet className="w-5 h-5" />
            <span>Kết nối MetaMask & Đăng nhập</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-sans flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-[#f0f1f5] text-[11px] text-[#737780] text-center">
        Mọi giao dịch và chữ ký xác thực được kiểm soát chặt chẽ theo tiêu chuẩn bảo mật của Smart Contract ChainVerify.
      </div>
    </div>
  );
}
