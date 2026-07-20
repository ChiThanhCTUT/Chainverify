import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders } from 'lucide-react';

export default function DemoControls() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#001e40] text-[#a7c8ff] px-4 py-2 border-b border-[#003366] text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
        <span className="font-sans font-bold text-white tracking-wide">
          ĐIỀU KHIỂN THỬ NGHIỆM:
        </span>
        <span className="text-white opacity-75">Chuyển hướng nhanh theo React Router</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1 bg-[#003366] hover:bg-white hover:text-[#001e40] text-white rounded font-bold text-[10px] uppercase transition-colors cursor-pointer"
        >
          🌐 Trang chủ (/)
        </button>
        <button
          onClick={() => navigate('/verify')}
          className="px-3 py-1 bg-[#003366] hover:bg-white hover:text-[#001e40] text-white rounded font-bold text-[10px] uppercase transition-colors cursor-pointer"
        >
          🔍 Xác minh (/verify)
        </button>
        <button
          onClick={() => navigate('/student')}
          className="px-3 py-1 bg-[#003366] hover:bg-white hover:text-[#001e40] text-white rounded font-bold text-[10px] uppercase transition-colors cursor-pointer"
        >
          🎓 Sinh viên (/student)
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="px-3 py-1 bg-[#003366] hover:bg-white hover:text-[#001e40] text-white rounded font-bold text-[10px] uppercase transition-colors cursor-pointer"
        >
          🔐 Quản trị (/admin)
        </button>
      </div>
    </div>
  );
}
