const crypto = require('crypto');
const fs = require('fs');

const uploadPDF = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded or file is not a PDF.' });
    }
    
    // Calculate SHA-256 hash of the file
    const fileBuffer = fs.readFileSync(req.file.path);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hexHash = hashSum.digest('hex');
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      checksum: hexHash,
      sha256Hash: hexHash,
      pdfUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error in uploadPDF:', error);
    res.status(500).json({ success: false, message: 'Server error during file upload.' });
  }
};

module.exports = {
  uploadPDF
};
