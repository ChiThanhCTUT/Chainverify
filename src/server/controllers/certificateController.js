// Controller cho các API liên quan đến Chứng chỉ
const pool = require('../config/db');
const crypto = require('crypto');

// 1. uploadCertificatePDF(file) - Module 15, 16
exports.uploadCertificatePDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không tìm thấy file tải lên' });
    }

    // Giả lập lấy file buffer và băm SHA-256
    const fileBuffer = req.file.buffer;
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const sha256Hash = hashSum.digest('hex');

    // TODO: Lưu thông tin vào Database nếu cần
    // const [result] = await pool.query('INSERT INTO certificates ...');

    res.json({
      success: true,
      data: {
        pdfUrl: 'https://example.com/mock-pdf-url.pdf', // Sẽ thay bằng Cloudinary/S3
        sha256Hash: `0x${sha256Hash}`,
        checksum: `0x${sha256Hash}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server khi upload PDF' });
  }
};

// 2. getAdminStatistics() - Lấy số liệu thống kê cho trang quản trị
exports.getAdminStatistics = async (req, res) => {
  try {
    // TODO: Lấy số liệu thực tế từ MySQL
    // const [rows] = await pool.query('SELECT count(*) as total FROM certificates');

    res.json({
      success: true,
      data: {
        totalIssued: 1500,
        totalVerified: 1200,
        activeStudents: 850
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server khi lấy thống kê' });
  }
};

// 3. getCertificatesFromBackend() - Trả về danh sách chứng chỉ từ MySQL
exports.getCertificatesFromBackend = async (req, res) => {
  try {
    // TODO: Truy vấn danh sách từ bảng MySQL
    // const [rows] = await pool.query('SELECT * FROM certificates');
    
    const mockCertificates = [
      { id: 1, studentName: 'Nguyễn Văn A', major: 'Công nghệ thông tin' },
      { id: 2, studentName: 'Trần Thị B', major: 'Kinh tế' }
    ];

    res.json({
      success: true,
      data: mockCertificates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách chứng chỉ' });
  }
};
