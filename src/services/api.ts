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
  try {
    const res: any = await api.post('/certificates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Hỗ trợ cả chuẩn { success: true, data: { ... } } của BIN và { checksum: ... } trực tiếp
    const payload = res?.data || res;
    return {
      pdfUrl: payload.pdfUrl || 'https://example.com/mock-pdf.pdf',
      sha256Hash: payload.sha256Hash || payload.checksum || '0x...',
      checksum: payload.checksum || payload.sha256Hash || '0x...',
      fileName: payload.fileName || file.name,
    };
  } catch (err) {
    console.warn('[API Fallback] Backend của BIN chưa chạy (port 5000). Tự động băm SHA-256 trên trình duyệt...');
    // Fallback sang Web Crypto API để UI của THANH luôn chạy mượt
    const { calculateFileSHA256 } = await import('../utils/crypto');
    const localHash = await calculateFileSHA256(file);
    return {
      pdfUrl: URL.createObjectURL(file),
      sha256Hash: localHash,
      checksum: localHash,
      fileName: file.name,
    };
  }
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
  try {
    const res: any = await api.get('/certificates/admin/statistics');
    const payload = res?.data || res;
    return {
      totalIssued: payload.totalIssued ?? 0,
      totalVerified: payload.totalVerified ?? 0,
      activeStudents: payload.activeStudents ?? 0,
      revokedCount: payload.revokedCount ?? 0,
    };
  } catch (err) {
    console.error('[API Error] Không lấy được thống kê từ CSDL, hiển thị 0...');
    return {
      totalIssued: 0,
      totalVerified: 0,
      activeStudents: 0,
      revokedCount: 0,
    };
  }
};

// ==========================================
// [BIN TODO 3]: API Lấy danh sách chứng chỉ (100% từ MySQL)
// ==========================================
export const getCertificatesFromBackend = async (): Promise<Certificate[]> => {
  try {
    const res: any = await api.get('/certificates');
    const list = res?.data || (Array.isArray(res) ? res : []);
    if (Array.isArray(list)) {
      return list.map((item: any) => ({
        id: item.id,
        recipientName: item.recipientName,
        courseProgram: item.courseProgram,
        issueDate: item.issueDate ? new Date(item.issueDate).toLocaleDateString('vi-VN') : item.issueDate,
        status: item.status || 'Pending',
        txHash: item.txHash || '',
        checksum: item.checksum || '',
        issuerName: item.issuerName || '',
        issuerLogo: item.issuerLogo || '',
        timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : item.issueDate,
      }));
    }
    return [];
  } catch (err) {
    console.error('[API Error] Không kết nối được MySQL API, trả về danh sách trống...');
    return [];
  }
};
export const createCertificateInBackend = async (cert: Certificate): Promise<boolean> => {
  try {
    // MySQL backend expects dates in standard formats. We will just pass strings.
    const payload = {
      id: cert.id,
      recipientName: cert.recipientName,
      courseProgram: cert.courseProgram,
      issueDate: new Date().toISOString(), // Standard SQL date format compatibility
      status: cert.status,
      txHash: cert.txHash,
      checksum: cert.checksum,
      issuerName: cert.issuerName,
      issuerLogo: cert.issuerLogo
    };
    await api.post('/certificates', payload);
    return true;
  } catch (err) {
    console.error('[API Error] Không thể lưu văn bằng vào MySQL Backend:', err);
    return false;
  }
};

export const updateCertificateStatusInBackend = async (certId: string, status: string): Promise<boolean> => {
  try {
    await api.put(`/certificates/${certId}`, { status });
    return true;
  } catch (err) {
    console.error('[API Error] Không thể cập nhật trạng thái trên MySQL Backend:', err);
    return false;
  }
};

export default api;
