import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', organization: '', message: '' });
    }, 4000);
  };

  return (
    <div className="w-full animate-fadeIn max-w-5xl mx-auto py-4">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#001e40] tracking-tight mb-4">
          Liên hệ & Hợp tác Tổ chức
        </h1>
        <p className="font-sans text-base text-[#505f76] max-w-2xl mx-auto leading-relaxed">
          Đội ngũ kỹ thuật ChainVerify luôn sẵn sàng hỗ trợ các nhà trường, cơ quan giáo dục tích hợp API xác thực Blockchain vào hệ thống quản lý đào tạo hiện hữu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="bg-[#001e40] text-white p-8 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Thông tin Trường Đào tạo</span>
            </h3>
            <div className="space-y-6 text-sm font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white mb-1">Địa chỉ trụ sở chính:</strong>
                  <span className="text-gray-300 leading-relaxed">
                    Trường Đại học Kỹ thuật Công nghệ Cần Thơ (CTUT)<br />
                    Số 256 Nguyễn Văn Cừ, Quận Ninh Kiều, TP. Cần Thơ
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white mb-1">Hỗ trợ kỹ thuật & API:</strong>
                  <span className="text-gray-300">support@chainverify.edu.vn</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white mb-1">Đường dây nóng phòng Quản trị:</strong>
                  <span className="text-gray-300">(+84) 292 3899 888</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[#003366] text-xs text-gray-400">
            Giờ làm việc: Thứ Hai – Thứ Sáu (07:30 - 17:00 GMT+7)
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-[#c3c6d1] p-8 md:p-10 rounded-2xl shadow-xs">
          <h3 className="font-serif text-2xl font-bold text-[#001e40] mb-2">Gửi yêu cầu tích hợp / Giải đáp thắc mắc</h3>
          <p className="font-sans text-xs text-[#505f76] mb-8">
            Vui lòng điền thông tin bên dưới, bộ phận điều phối hệ thống sẽ liên hệ phản hồi trong vòng 24 giờ làm việc.
          </p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-xl text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-bold text-lg mb-1">Đã tiếp nhận thông tin thành công!</h4>
              <p className="text-sm opacity-90">
                Yêu cầu của bạn đã được chuyển tới phòng Kỹ thuật Mật mã ChainVerify. Chúng tôi sẽ sớm liên hệ qua Email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-sans text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#001e40] uppercase mb-1.5">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Chí Thanh"
                    className="w-full p-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg outline-none focus:border-[#001e40] text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#001e40] uppercase mb-1.5">Địa chỉ Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@university.edu.vn"
                    className="w-full p-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg outline-none focus:border-[#001e40] text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001e40] uppercase mb-1.5">Tổ chức / Trường học</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Ví dụ: Trường Đại học Kỹ thuật Công nghệ Cần Thơ"
                  className="w-full p-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg outline-none focus:border-[#001e40] text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001e40] uppercase mb-1.5">Nội dung yêu cầu *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mô tả chi tiết nhu cầu tích hợp API, đăng ký làm Issuer hoặc thắc mắc về văn bằng..."
                  className="w-full p-3 bg-[#f9f9fe] border border-[#c3c6d1] rounded-lg outline-none focus:border-[#001e40] text-sm transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#001e40] hover:bg-[#003366] text-white px-8 py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                <span>Gửi yêu cầu tới ChainVerify</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
