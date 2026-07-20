/**
 * Tiện ích băm mã và xử lý mật mã giả lập cho Frontend
 * - Khi BIN (Backend) làm xong Module 16 (Sinh SHA256 cho file PDF), mã hash thực tế sẽ do API Backend trả về.
 * - Khi CÔNG (Blockchain) làm xong Module 18 (Xác minh trên Smart Contract), hash sẽ được đối chiếu on-chain.
 */

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
