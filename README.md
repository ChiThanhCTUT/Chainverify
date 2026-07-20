<div align="center">
  <h1 style="font-family: serif; color: #001e40;">🎓 CHAINVERIFY</h1>
  <h3>Hệ thống Xác minh Chứng chỉ & Văn bằng Học thuật trên nền tảng Blockchain</h3>
  <p><strong>Dự án Đồ án Chuyên ngành / Kỹ thuật Phần mềm</strong></p>
</div>

---

## 📌 Giới thiệu Dự án

**ChainVerify** là ứng dụng Web3 cung cấp giải pháp cấp phát, lưu trữ và xác minh tính hợp lệ của văn bằng học thuật, bảng điểm, chứng chỉ chuyên môn trên mạng lưới Blockchain (Sepolia / Ethereum). Hệ thống áp dụng chữ ký mật mã **Smart Contract** kết hợp thuật toán băm **SHA-256**, giúp chống làm giả tài liệu và cho phép nhà tuyển dụng tra cứu tức thời chỉ với vài giây.

---

## 👥 Nhóm Phát triển & Quy ước Cộng tác (Team Mapping)

Dự án được phân chia trách nhiệm rõ ràng theo các Module giữa 3 thành viên (**THANH - BIN - CÔNG**):

| Thành viên | Phụ trách chính | Các Module / Thư mục tương tác chính |
| :--- | :--- | :--- |
| **THANH** *(Trưởng Frontend / UI-UX)* | **Module 7, 8, 14, 17, 18, 19, 20**<br>Thiết kế UI/UX, Setup ReactJS, cấu hình Ethers.js, sinh QR Code & xây dựng trọn vẹn sườn Frontend. | • Toàn bộ `src/pages/` và `src/components/`<br>• `src/components/QRCodeGenerator.tsx`<br>• `src/services/blockchainService.ts` |
| **BIN** *(Trưởng Backend API & DB)* | **Module 5, 6, 9, 10, 15, 16, 19**<br>Thiết kế MySQL schema, NodeJS + Express API, Multer upload PDF và băm SHA-256. | • Thư mục riêng `backend/` (Server Node.js)<br>• **Điểm chạm Frontend:** `src/services/api.ts` *(cập nhật API endpoints)* |
| **CÔNG** *(Trưởng Blockchain & Smart Contract)* | **Module 4, 11, 12, 13, 18**<br>Viết Smart Contract Solidity, compile/deploy bằng Hardhat, xử lý đăng nhập MetaMask. | • Thư mục riêng `blockchain/` (Hardhat)<br>• **Điểm chạm Frontend:** `src/contracts/config.ts`, `CertificateABI.json` & `src/hooks/useWallet.ts` |

---

## 📂 Cấu trúc Thư mục Frontend (`src/`)

```text
chainverify/
├── src/
│   ├── pages/                   # Các trang chính: Home, Login, Verify, StudentDashboard, AdminDashboard
│   ├── components/              # UI dùng chung: Navbar, Footer, Button, Modal, Table, CertificateCard, QRCodeGenerator
│   ├── services/
│   │   ├── api.ts               # [BIN TODO]: Cấu hình Axios gọi API NodeJS/Express
│   │   └── blockchainService.ts # [THANH & CÔNG TODO]: Gọi Smart Contract qua ethers.js
│   ├── hooks/
│   │   └── useWallet.ts         # [CÔNG TODO]: Custom hook quản lý đăng nhập MetaMask (Module 13)
│   ├── contracts/
│   │   ├── config.ts            # [CÔNG TODO]: Địa chỉ Smart Contract và Chain ID
│   │   └── CertificateABI.json  # [CÔNG TODO]: File ABI sau khi compile từ Hardhat
│   ├── utils/                   # Các tiện ích băm mã, định dạng ngày tháng
│   └── App.tsx                  # Cấu hình Layout chung & định tuyến React Router
├── .env.example                 # Mẫu file cấu hình môi trường (.env)
├── package.json                 # Cấu hình phụ thuộc dự án
└── README.md                    # Tài liệu hướng dẫn nhóm
```

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Dành cho thành viên nhóm)

### 1. Chuẩn bị Môi trường
- Cài đặt **Node.js** (phiên bản >= 18.x).
- Cài đặt tiện ích mở rộng ví **MetaMask** trên trình duyệt web.

### 2. Cài đặt Phụ thuộc & Chạy Dev Server
Mở Terminal tại thư mục gốc của dự án (`chainverify`) và gõ:

```bash
# 1. Cài đặt toàn bộ các thư viện (React Router, Axios, Ethers, TailwindCSS...)
npm install

# 2. Sao chép file cấu hình môi trường
cp .env.example .env

# 3. Khởi chạy máy chủ phát triển
npm run dev
```

Truy cập ứng dụng tại địa chỉ: 👉 **http://localhost:3000**

---

## 🔧 Điểm chạm Handoff (Cách Bin và Công đấu nối vào Frontend)

### 🟢 Dành cho BIN (Backend API)
1. Bin khởi chạy server Node.js + Express tại cổng `5000`.
2. Mở file `.env`, đặt `VITE_API_BASE_URL="http://localhost:5000/api"`.
3. Mở file `src/services/api.ts`, tìm các từ khóa `// [BIN TODO]` để mở comment và cấu hình trả dữ liệu cho các hàm `uploadCertificatePDF()`, `getAdminStatistics()`, `getCertificatesFromBackend()`.

### 🟡 Dành cho CÔNG (Smart Contract & MetaMask)
1. Sau khi deploy Smart Contract `CertificateRegistry.sol` từ Hardhat lên Sepolia/Localhost, Công sao chép địa chỉ hợp đồng dán vào biến `CONTRACT_ADDRESS` trong `src/contracts/config.ts`.
2. Dán nội dung JSON ABI thu được vào `src/contracts/CertificateABI.json`.
3. Mở file `src/hooks/useWallet.ts`, tìm `// [CÔNG - METAMASK TODO]` và mở comment đoạn gọi `window.ethereum.request({ method: 'eth_requestAccounts' })` để kích hoạt đăng nhập ví thật.

---

## ✅ Kiểm thử Chất lượng Mã nguồn

Trước khi Push/Merge nhánh mới lên GitHub, hãy chạy kiểm thử:

```bash
# Kiểm tra lỗi cú pháp & kiểu dữ liệu TypeScript (Đảm bảo 0 errors)
npm run lint

# Thử đóng gói sản xuất (Đảm bảo build thành công)
npm run build
```

---
*© 2024 ChainVerify Team. All rights reserved.*
