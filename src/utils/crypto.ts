/**
 * [THANH & CÔNG - MODULE 18 COMPLETED]: Tiện ích băm mã và xử lý mật mã cho Frontend
 * - Tích hợp Web Crypto API (crypto.subtle) của trình duyệt để băm SHA-256 thực sự tệp tin PDF hoặc chuỗi văn bản.
 * - Hỗ trợ kiểm tra định dạng Hash, sinh Hash giả lập khi test chưa có file gốc.
 */

/**
 * [STT 35]: Tính toán mã băm SHA-256 thực tế của một tệp tin (file PDF gốc) ngay trên trình duyệt
 * - Đảm bảo tính riêng tư: File không gửi đi đâu mà được băm ngay tại máy client bằng bộ xử lý mật mã của trình duyệt.
 */
export const calculateFileSHA256 = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (err) {
    console.error('Lỗi tính băm SHA-256 file:', err);
    throw new Error('Không thể tính toán mã băm mật mã của tệp tin này.');
  }
};

/**
 * Tính toán mã băm SHA-256 của một chuỗi ký tự (String)
 */
export const calculateTextSHA256 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const generateRandomHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
};

export const generateRandomChecksum = (): string => {
  const chars = '0123456789abcdef';
  let checksum = '';
  for (let i = 0; i < 64; i++) {
    checksum += chars[Math.floor(Math.random() * 16)];
  }
  return checksum;
};

/**
 * Kiểm tra định dạng hash 64 ký tự hex hợp lệ (có hoặc không có tiền tố 0x)
 */
export const isValidHexHash = (hashString: string): boolean => {
  const clean = hashString.startsWith('0x') ? hashString.slice(2) : hashString;
  return /^[0-9a-fA-F]{64}$/.test(clean);
};
