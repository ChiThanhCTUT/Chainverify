const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));

// Import Routes
const certificateRoutes = require('./routes/certificateRoutes');
const sequelize = require('./config/db');

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ChainVerify API' });
});

// Mount Routes
app.use('/api/certificates', certificateRoutes);

const Certificate = require('./models/Certificate');

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  sequelize.sync().then(async () => {
    console.log('Database synced successfully');
    try {
      const count = await Certificate.count();
      if (count === 0) {
        console.log('Database is empty. Seeding initial certificates...');
        await Certificate.bulkCreate([
          // 3 Văn bằng thực tế của thành viên nhóm ChainVerify
          {
            id: 'STU-2024-001',
            recipientName: 'Nguyễn Chí Thanh',
            courseProgram: 'Kỹ thuật Phần mềm & Mật mã Blockchain',
            issueDate: new Date('2026-06-15'),
            status: 'Valid',
            txHash: '0x54ce598f909785BB835cccEB75F00AC99A32D373a1b2c3d4e5f6',
            checksum: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            issuerName: 'Đại học Kỹ thuật Công nghệ (CTUT)',
            issuerLogo: 'https://example.com/logo.png'
          },
          {
            id: 'STU-2024-002',
            recipientName: 'Nguyễn Thành Công',
            courseProgram: 'An toàn Thông tin & Hợp đồng Thông minh Solidity',
            issueDate: new Date('2026-06-15'),
            status: 'Valid',
            txHash: '0x88bbccaa11223344556677889900aabbccddeeff1122334455',
            checksum: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
            issuerName: 'Đại học Kỹ thuật Công nghệ (CTUT)',
            issuerLogo: 'https://example.com/logo.png'
          },
          {
            id: 'STU-2024-003',
            recipientName: 'Phạm Su Bin',
            courseProgram: 'Kiến trúc Hệ thống & API Mạng Phân tán',
            issueDate: new Date('2026-06-15'),
            status: 'Valid',
            txHash: '0x990011223344556677889900aabbccddeeff112233445566',
            checksum: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
            issuerName: 'Đại học Kỹ thuật Công nghệ (CTUT)',
            issuerLogo: 'https://example.com/logo.png'
          },
          // 4 Văn bằng mẫu từ file chainverify_sample.sql (Trường ĐH Cần Thơ CTU)
          {
            id: 'CERT-2026-001',
            recipientName: 'Nguyễn Văn A',
            courseProgram: 'Kỹ thuật Phần mềm (Software Engineering)',
            issueDate: new Date('2026-01-15'),
            status: 'Valid',
            txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            checksum: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            issuerName: 'Trường Đại học Cần Thơ (CTU)',
            issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_Truong_Dai_hoc_Can_Tho.png'
          },
          {
            id: 'CERT-2026-002',
            recipientName: 'Trần Thị B',
            courseProgram: 'Khoa học Máy tính (Computer Science)',
            issueDate: new Date('2026-02-20'),
            status: 'Valid',
            txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            checksum: '0x5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
            issuerName: 'Trường Đại học Cần Thơ (CTU)',
            issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_Truong_Dai_hoc_Can_Tho.png'
          },
          {
            id: 'CERT-2026-003',
            recipientName: 'Lê Hoàng C',
            courseProgram: 'Hệ thống Thông tin (Information Systems)',
            issueDate: new Date('2026-03-10'),
            status: 'Pending',
            txHash: null,
            checksum: '0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
            issuerName: 'Trường Đại học Cần Thơ (CTU)',
            issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_Truong_Dai_hoc_Can_Tho.png'
          },
          {
            id: 'CERT-2026-004',
            recipientName: 'Phạm Minh D',
            courseProgram: 'Mạng máy tính & Truyền thông',
            issueDate: new Date('2026-04-05'),
            status: 'Revoked',
            txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
            checksum: '0xd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666ec13ab110',
            issuerName: 'Trường Đại học Cần Thơ (CTU)',
            issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_Truong_Dai_hoc_Can_Tho.png'
          }
        ]);
        console.log('Initial seed certificates inserted successfully!');
      }
    } catch (seedErr) {
      console.error('Failed to seed initial certificates:', seedErr.message);
    }
  }).catch(err => {
    console.error('Failed to sync db: ' + err.message);
  });
});
