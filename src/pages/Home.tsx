import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Wallet, Shield, Eye, Timer } from 'lucide-react';
import { HERO_PHONE_IMAGE } from '../data';

interface HomeProps {
  isConnected: boolean;
  onConnectWallet: () => void;
}

export default function Home({ isConnected, onConnectWallet }: HomeProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full animate-fadeIn">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-8 md:mt-16 max-w-3xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#001e40] font-bold tracking-tight leading-tight mb-6">
          Bảo mật Chứng chỉ Học thuật trên Blockchain
        </h1>
        <p className="font-sans text-base md:text-lg text-[#505f76] mb-10 max-w-2xl leading-relaxed">
          Tiêu chuẩn của các tổ chức giáo dục trong việc xác minh văn bằng, bảng điểm và chứng chỉ chuyên môn bằng mật mã. Nhanh chóng, bất biến và được tin cậy toàn cầu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <button
            onClick={() => navigate('/verify')}
            className="bg-[#001e40] hover:bg-[#003366] text-white px-8 py-3.5 rounded font-sans text-base font-semibold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Search className="w-5 h-5 stroke-[2]" />
            Xác minh Chứng chỉ
          </button>
          <button
            onClick={isConnected ? () => navigate('/admin') : onConnectWallet}
            className={`px-8 py-3.5 rounded font-sans text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 border cursor-pointer active:scale-[0.98] ${
              isConnected
                ? 'bg-[#d0e1fb] text-[#001e40] border-[#a7c8ff]'
                : 'bg-transparent text-[#505f76] border-[#737780] hover:bg-[#f4f3f8]'
            }`}
          >
            <Wallet className="w-5 h-5 stroke-[2]" />
            {isConnected ? 'Vào Cổng Quản Trị' : 'Kết nối Ví MetaMask'}
          </button>
        </div>
      </section>

      {/* Image Feature Section */}
      <section className="w-full relative rounded-xl overflow-hidden border border-[#c3c6d1] mt-16 md:mt-20 shadow-xs">
        <div
          className="bg-cover bg-center w-full h-[400px] md:h-[500px]"
          style={{ backgroundImage: `url('${HERO_PHONE_IMAGE}')` }}
          aria-label="Smartphone displaying certificate"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#001e40]/85 via-[#001e40]/40 to-transparent flex items-end p-8 md:p-12">
          <div className="text-white max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold mb-3">
              Bằng chứng Bất biến
            </h2>
            <p className="font-sans text-sm md:text-base opacity-90 leading-relaxed">
              Mã hóa SHA-256 đảm bảo rằng khi một chứng chỉ được cấp lên mạng lưới Blockchain, nó không bao giờ có thể bị sửa đổi hoặc làm giả.
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="mt-20 md:mt-28">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[#001e40] font-semibold mb-4">
            Tại sao các Tổ chức chọn ChainVerify
          </h2>
          <p className="font-sans text-sm md:text-base text-[#505f76] max-w-2xl mx-auto">
            Cơ sở hạ tầng hiện đại được xây dựng cho các tiêu chuẩn học thuật nghiêm ngặt, thay thế gian lận giấy tờ bằng sự xác thực kỹ thuật số chắc chắn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#c3c6d1] p-8 rounded hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-[#f4f3f8] text-[#001e40] rounded-full flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#001e40] mb-3">Bảo mật Cấp độ Quân sự</h3>
            <p className="font-sans text-sm text-[#505f76] leading-relaxed">
              Hệ thống phi tập trung ngăn chặn điểm lỗi đơn lẻ. Mỗi chứng chỉ đều được ký mã hóa bảo mật bằng Smart Contract.
            </p>
          </div>
          <div className="bg-white border border-[#c3c6d1] p-8 rounded hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-[#f4f3f8] text-[#001e40] rounded-full flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#001e40] mb-3">Minh bạch Tuyệt đối</h3>
            <p className="font-sans text-sm text-[#505f76] leading-relaxed">
              Xác minh trên sổ cái công khai cho phép bất kỳ bên thứ ba nào cũng có thể xác nhận tính hợp lệ tức thời.
            </p>
          </div>
          <div className="bg-white border border-[#c3c6d1] p-8 rounded hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-[#f4f3f8] text-[#001e40] rounded-full flex items-center justify-center mb-6">
              <Timer className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#001e40] mb-3">Xác minh Tức thì</h3>
            <p className="font-sans text-sm text-[#505f76] leading-relaxed">
              Giảm thiểu thời gian xác minh từ vài tuần xuống còn vài giây thông qua mã QR và tra cứu Hash.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
