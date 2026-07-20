const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const multer = require('multer');

// Cấu hình Multer để lưu file tạm trong memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// === CÁC API CRUD CHÍNH ===

// CREATE - Tạo mới chứng chỉ
router.post('/', certificateController.createCertificate);

// READ - Lấy danh sách tất cả chứng chỉ
router.get('/', certificateController.getAllCertificates);

// READ - Lấy chi tiết một chứng chỉ theo ID
router.get('/:id', certificateController.getCertificateById);

// UPDATE - Cập nhật thông tin chứng chỉ (VD: Đổi status thành Revoked)
router.put('/:id', certificateController.updateCertificate);

// DELETE - Xóa chứng chỉ
router.delete('/:id', certificateController.deleteCertificate);

// === CÁC API NGHIỆP VỤ (Theo tài liệu Handoff) ===

// API Upload PDF & băm SHA-256
router.post('/upload', upload.single('file'), certificateController.uploadCertificatePDF);

// API Thống kê cho Admin
router.get('/admin/statistics', certificateController.getAdminStatistics);

module.exports = router;
