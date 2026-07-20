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
  const formData = new FormData();
  formData.append('file', file);
  return await api.post('/certificates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
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
  return await api.get('/certificates/admin/statistics');
};

// ==========================================
// [BIN TODO 3]: API Lấy danh sách chứng chỉ (từ MySQL của BIN hoặc phối hợp on-chain)
// ==========================================
export const getCertificatesFromBackend = async (): Promise<Certificate[]> => {
  return await api.get('/certificates');
};

export default api;
