// Controller cho các API liên quan đến Chứng chỉ
const pool = require('../config/db');
const crypto = require('crypto');

// ==========================================
// CÁC HÀM CRUD (RESTful API)
// ==========================================

// 1. CREATE - Thêm mới chứng chỉ
exports.createCertificate = async (req, res) => {
  try {
    const { id, recipientName, courseProgram, issueDate, status, txHash, checksum, issuerName, issuerLogo } = req.body;
    
    const query = `
      INSERT INTO certificates 
      (id, recipientName, courseProgram, issueDate, status, txHash, checksum, issuerName, issuerLogo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await pool.query(query, [
      id, recipientName, courseProgram, issueDate, status || 'Pending', txHash, checksum, issuerName, issuerLogo
    ]);

    res.status(201).json({ success: true, message: 'Tạo chứng chỉ thành công', data: { id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Lỗi server khi tạo chứng chỉ' });
  }
};

// 2. READ ALL - Lấy danh sách chứng chỉ (có hỗ trợ phân trang/tìm kiếm cơ bản)
exports.getAllCertificates = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM certificates ORDER BY timestamp DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Lỗi server khi lấy danh sách' });
  }
};

// 3. READ ONE - Lấy chi tiết một chứng chỉ theo ID
exports.getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy chứng chỉ' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Lỗi server khi lấy chi tiết chứng chỉ' });
  }
};

// 4. UPDATE - Cập nhật chứng chỉ (Thường dùng để đổi trạng thái Revoked/Valid hoặc update txHash)
exports.updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, txHash } = req.body;
    
    // Cập nhật linh hoạt các trường được gửi lên
    let updateFields = [];
    let queryParams = [];
    
    if (status) { updateFields.push('status = ?'); queryParams.push(status); }
    if (txHash) { updateFields.push('txHash = ?'); queryParams.push(txHash); }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'Không có dữ liệu cập nhật' });
    }
    
    queryParams.push(id);
    const query = `UPDATE certificates SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.query(query, queryParams);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy chứng chỉ để cập nhật' });
    }
    
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Lỗi server khi cập nhật chứng chỉ' });
  }
};

// 5. DELETE - Xóa chứng chỉ
exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM certificates WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy chứng chỉ để xóa' });
    }
    
    res.json({ success: true, message: 'Xóa chứng chỉ thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Lỗi server khi xóa chứng chỉ' });
  }
};

// ==========================================
// CÁC HÀM NGHIỆP VỤ (Hand-off points)
// ==========================================

// uploadCertificatePDF(file) - Module 15, 16
exports.uploadCertificatePDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không tìm thấy file tải lên' });
    }

    const fileBuffer = req.file.buffer;
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const sha256Hash = hashSum.digest('hex');

    res.json({
      success: true,
      data: {
        pdfUrl: 'https://example.com/mock-pdf-url.pdf', // Cần thay bằng Cloudinary/S3 thực tế
        sha256Hash: `0x${sha256Hash}`,
        checksum: `0x${sha256Hash}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server khi upload PDF' });
  }
};

// getAdminStatistics() - Lấy số liệu thống kê cho trang quản trị
exports.getAdminStatistics = async (req, res) => {
  try {
    // Lấy số liệu thực tế từ MySQL
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM certificates');
    const [verifiedRows] = await pool.query("SELECT COUNT(*) as total FROM certificates WHERE status = 'Valid'");
    
    // Giả lập số sinh viên active (hoặc đếm số lượng recipientName distinct)
    const [studentRows] = await pool.query('SELECT COUNT(DISTINCT recipientName) as total FROM certificates');

    res.json({
      success: true,
      data: {
        totalIssued: totalRows[0].total,
        totalVerified: verifiedRows[0].total,
        activeStudents: studentRows[0].total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server khi lấy thống kê' });
  }
};
