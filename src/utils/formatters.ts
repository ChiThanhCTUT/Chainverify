/**
 * Tiện ích định dạng ngày tháng, số liệu và chuỗi hiển thị
 */

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Trả về nguyên gốc nếu chuỗi đã format sẵn (ví dụ "15 tháng 10, 2023")
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Cắt ngắn địa chỉ ví hoặc hash để hiển thị gọn trên UI (Ví dụ: 0x8f2a...f3e1)
 */
export const truncateHash = (hash: string, startLength = 6, endLength = 4): string => {
  if (!hash || hash.length <= startLength + endLength) return hash;
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
};
