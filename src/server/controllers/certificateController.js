// Controller cho các API liên quan đến Chứng chỉ
const Certificate = require('../models/Certificate');
const crypto = require('crypto');

// ==========================================
// CÁC HÀM CRUD (RESTful API)
// ==========================================

// 1. CREATE - Thêm mới chứng chỉ
exports.createCertificate = async (req, res) => {
  try {
    const { id, recipientName, courseProgram, issueDate, status, txHash, checksum, issuerName, issuerLogo } = req.body;
    
    const newCert = await Certificate.create({
      id, recipientName, courseProgram, issueDate, status: status || 'Pending', txHash, checksum, issuerName, issuerLogo
    });

    res.status(201).json({ success: true, message: 'Tạo chứng chỉ thành công', data: newCert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Lỗi server khi tạo chứng chỉ' });
  }
};

// 2. READ ALL - Lấy danh sách chứng chỉ (có hỗ trợ phân trang/tìm kiếm cơ bản)
exports.getAllCertificates = async (req, res) => {
  try {
    const rows = await Certificate.findAll({
      order: [['createdAt', 'DESC']]
    });
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
    const cert = await Certificate.findByPk(id);
    
    if (!cert) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy chứng chỉ' });
    }
    
    res.json({ success: true, data: cert });
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
    
    let updateFields = {};
    if (status) updateFields.status = status;
    if (txHash) updateFields.txHash = txHash;
    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, error: 'Không có dữ liệu cập nhật' });
    }
    
    const [updatedRowsCount] = await Certificate.update(updateFields, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
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
    const deletedRowsCount = await Certificate.destroy({
      where: { id }
    });
    
    if (deletedRowsCount === 0) {
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
        checksum: `0x${sha256Hash}`,
        fileName: req.file.originalname
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
    const totalIssued = await Certificate.count();
    const totalVerified = await Certificate.count({ where: { status: 'Valid' } });
    const revokedCount = await Certificate.count({ where: { status: 'Revoked' } });
    
    // Giả lập số sinh viên active bằng cách đếm số lượng recipientName distinct
    const activeStudents = await Certificate.count({
      distinct: true,
      col: 'recipientName'
    });

    res.json({
      success: true,
      data: {
        totalIssued,
        totalVerified,
        activeStudents,
        revokedCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server khi lấy thống kê' });
  }
};
