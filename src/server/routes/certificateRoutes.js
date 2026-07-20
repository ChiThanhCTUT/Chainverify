const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const multer = require('multer');

// Cấu hình Multer để lưu file tạm trong memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes định nghĩa dựa trên Controller
router.post('/upload', upload.single('file'), certificateController.uploadCertificatePDF);
router.get('/admin/statistics', certificateController.getAdminStatistics);
router.get('/list', certificateController.getCertificatesFromBackend);

module.exports = router;
