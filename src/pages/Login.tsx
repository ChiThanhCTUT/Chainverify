import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginProps {
  isConnected: boolean;
  account: string | null;
  onConnectWallet: () => void;
}

export default function Login({ isConnected, account, onConnectWallet }: LoginProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#c3c6d1] rounded-2xl shadow-sm text-center animate-fadeIn">
      <div className="w-16 h-16 bg-[#001e40] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
        <Wallet className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-[#001e40] mb-2">Đăng nhập Web3</h2>
      <p className="font-sans text-sm text-[#505f76] mb-8 leading-relaxed">
        Kết nối ví MetaMask của bạn để xác định danh tính và truy cập vào Cổng Quản trị hoặc Cổng Sinh viên.
      </p>

      {isConnected ? (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-mono break-all flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{account}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="bg-[#001e40] hover:bg-[#003366] text-white py-3 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Vào Quản trị</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/student')}
              className="bg-[#f4f3f8] hover:bg-[#e0e2ec] text-[#001e40] py-3 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#c3c6d1]"
            >
              <span>Vào Sinh viên</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onConnectWallet}
          className="w-full bg-[#001e40] hover:bg-[#003366] text-white py-3.5 px-6 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <Wallet className="w-5 h-5" />
          <span>Kết nối MetaMask ngay</span>
        </button>
      )}

      <div className="mt-8 pt-6 border-t border-[#f0f1f5] text-[11px] text-[#737780]">
        Mọi giao dịch cấp phát văn bằng đều được ký số bảo mật bằng mạng lưới Blockchain Sepolia.
      </div>
    </div>
  );
}
