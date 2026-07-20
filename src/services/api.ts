/// <reference types="vite/client" />
import axios from 'axios';
import { Certificate } from '../types';

/**
 * [BIN - BACKEND API CONFIG & TODO - Module 9, 10, 15, 16, 19]
 * - Cấu hình Axios client kết nối với Express server của BIN.
 * - Khi BIN làm xong REST API ở Backend (Module 9), BIN chỉ cần chỉnh baseURL
 *   hoặc thêm các endpoints tương ứng bên dưới.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==========================================
// [BIN TODO 1]: API Upload PDF & Sinh SHA256 (Module 15, 16 - STT 29, 30, 31)
// ==========================================
export interface UploadPDFResponse {
  pdfUrl: string;
  sha256Hash: string;
  checksum: string;
  fileName: string;
}

export const uploadCertificatePDF = async (file: File): Promise<UploadPDFResponse> => {
  /* [BIN: Khi backend sẵn sàng, bỏ comment đoạn dưới]:
  const formData = new FormData();
  formData.append('pdfFile', file);
  return await api.post('/certificates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  */
  
  // Mock tạm thời cho THANH test UI khi BIN đang build backend:
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pdfUrl: URL.createObjectURL(file),
        sha256Hash: '0x8f2a64c9e4b7a1d3f5e8c2a9b6d4f1e7c3a5b8d2f0e4a6c9b7d5f3e1a8c2b4d6f9',
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        fileName: file.name,
      });
    }, 1200);
  });
};

// ==========================================
// [BIN TODO 2]: API Lấy thống kê cho Dashboard Admin (Module 19 - STT 35)
// ==========================================
export interface AdminStatsResponse {
  totalIssued: number;
  totalVerified: number;
  activeStudents: number;
  revokedCount: number;
}

export const getAdminStatistics = async (): Promise<AdminStatsResponse> => {
  /* [BIN: Khi backend sẵn sàng, bỏ comment]:
  return await api.get('/admin/stats');
  */
  return {
    totalIssued: 128,
    totalVerified: 1450,
    activeStudents: 85,
    revokedCount: 2,
  };
};

// ==========================================
// [BIN TODO 3]: API Lấy danh sách chứng chỉ (từ MySQL của BIN hoặc phối hợp on-chain)
// ==========================================
export const getCertificatesFromBackend = async (): Promise<Certificate[]> => {
  /* [BIN: Khi backend sẵn sàng]:
  return await api.get('/certificates');
  */
  const cached = localStorage.getItem('chainverify_certs');
  return cached ? JSON.parse(cached) : [];
};

export default api;
