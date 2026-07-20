import { Certificate } from './types';

export const STITCH_UNIVERSITY_LOGO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJg7TExNzw12HxeNuiMdQciETrXlRWwKwqdyKgw4LmzTUa5_QMSCr9b4OlEb8aZyrRNR7Dp8dIZF9eYixFK7yJWvItMl0KkVYfez4GNwQGV3fcI4RRIEJ3BRFhWZ97F6N7aeXVR_K_d4C9kMlLYuXU0GNZZVlSQUXH7tehlA75_pdSOV9EGfLuypn6EQegaFbTW3XDG61CcmMAbGXJaa020j0kfqdTlBHQJTQl11tHeK4N_peDHlqkYoev07if4wIQBQ_JlWcW30s';
export const HERO_PHONE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlTNMed87wzegMIUr0MviD02GW-m4BO9qRiYZIBBpQCUGPLHqa9C0XnIbmAWY50Ei2JdGQDE_9N_5CS92ThWoRgzMVsdMH607Uc3iWqQqgJB4oY7nice7GeXgWoVAXdY6A4x5InMNNmh-sud_PsazT5JtCU5TjSvCO5BzWYqwkGv1JWvDyGCyruLuB5H5cX8_ONksu5PDo8xVtNejDuRImQ9PaJRAlKHKJA1Rar1GiD2CbiS3PZLr2BtZZjFCcHMUROCPp_4bgrrY';
export const ADMIN_PROFILE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuABiLZnzl86xYtWDeK8y0C0OdBdtPtJ8wt6vmc7LqPSd4rHM21zMtrbbyXOuRNRNNuDIz-dFnqaAzx648bff6lz1JjRT-uluQrAaPVv2e-KoTjkoLFLIQoRmKofv-neuaUYNYZJKNEwBWPC4sRdsVYBuyaBikNeApZHv98ePjcwi2Dk-WT6HjWkyp1rGS0xfLtpumfrE7g9UVd2PG0bF8WLjLU2Cs69ewEvKXsEsR1GtItwBpMgcg9S2x3sR5KxKBXSSHpYTYQHlK0';
export const STUDENT_PROFILE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuClM_ffA5jD76sv3OIOJ6MAPFstbFiOAAv2YXBvwzkw0_tyuCILpJlfZ5PxxVitVKcRA00vM1w9HPgngWLHUtGAqLJcIzoUfFZYSaRFnLBmU7B4GPViZUHjXhTi2yvNALjEubLh7zkJzsGtNSLopuS8y_mYH-ZUBye9uHAXFMKSf2XFyjk-_x39tEZItepd3kdjiR3UtePnvQKEQIfMcGq14F8acbBso49n0oa0uzqX4CyLNHEA7cJvYbXLl04X0pn7wMyK394XS8I';
export const QR_CODE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSwN-7D-E6lwd3DDyuGl883YCj1epsS3nA4HB4a1FkwSeTVWux3aOmgQrqb0HGZEC-NYCl_neWuFyHe9Y4gG55wWqIrGo3ppIGJtFZGiCYddgb8MguYYAM_Xa_XaWhoE2kr1rZw3J4crx__oXi2KvR3tAxYcHZEEDpjzRGI-1-8PDX_cetr0m3NeX6pKMq3OKACTWtg1XT1zmiHP69LxCdYWoPoPiFwC2y_Rmq2eT5XAzogXQr-l2oDcmZAlbkWatCOXKxLTTtf38';

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'STU-992',
    recipientName: 'Alex Johnson',
    courseProgram: 'Cử nhân Khoa học Máy tính',
    issueDate: '15 tháng 10, 2023',
    status: 'Valid',
    txHash: '0x8f2a64c9e4b7a1d3f5e8c2a9b6d4f1e7c3a5b8d2f0e4a6c9b7d5f3e1a8c2b4d6f9',
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '24 thg 10, 2023 14:32:01 UTC'
  },
  {
    id: 'STU-8921',
    recipientName: 'Elena Rodriguez',
    courseProgram: 'Cử nhân Khoa học Máy tính (B.S.)',
    issueDate: '24 tháng 10, 2024',
    status: 'Valid',
    txHash: '0x8f3cb2e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    checksum: 'a5712eef43167bde500c9e68c1996f0117ae41e4649b934ca495991b7852ba71',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '24 thg 10, 2024 09:15:00 UTC'
  },
  {
    id: 'STU-8920',
    recipientName: 'James Chen',
    courseProgram: 'Thạc sĩ Phân tích Dữ liệu',
    issueDate: '23 tháng 10, 2024',
    status: 'Valid',
    txHash: '0x7e2db1c4a5f6e7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1bc',
    checksum: 'b6223eef43167bde500c9e68c1996f0117ae41e4649b934ca495991b7852bc34',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '23 thg 10, 2024 11:30:22 UTC'
  },
  {
    id: 'STU-8919',
    recipientName: 'Sarah Jenkins',
    courseProgram: 'Cử nhân Quản trị Kinh doanh',
    issueDate: '22 tháng 10, 2024',
    status: 'Valid',
    txHash: '0x6d1cb0b4a5f6e7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1de',
    checksum: 'c7334eef43167bde500c9e68c1996f0117ae41e4649b934ca495991b7852bd56',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '22 thg 10, 2024 16:45:10 UTC'
  },
  {
    id: 'STU-8918',
    recipientName: 'Michael Chang',
    courseProgram: 'Tiến sĩ Vật lý',
    issueDate: '21 tháng 10, 2024',
    status: 'Valid',
    txHash: '0x5c0ab9a4a5f6e7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1ef',
    checksum: 'd8445eef43167bde500c9e68c1996f0117ae41e4649b934ca495991b7852be78',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '21 thg 10, 2024 10:05:33 UTC'
  },
  {
    id: 'STU-8917',
    recipientName: 'Aisha Patel',
    courseProgram: 'Cử nhân Điều dưỡng',
    issueDate: '20 tháng 10, 2024',
    status: 'Valid',
    txHash: '0x4b9fa8a4a5f6e7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1f0',
    checksum: 'e9556eef43167bde500c9e68c1996f0117ae41e4649b934ca495991b7852bf89',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '20 thg 10, 2024 14:20:15 UTC'
  },
  {
    id: 'STU-MCS24',
    recipientName: 'Hồ sơ Sinh viên',
    courseProgram: 'Thạc sĩ Khoa học Máy tính',
    issueDate: '15 tháng 5, 2024',
    status: 'Valid',
    txHash: '0x8f3cb2e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '15 thg 5, 2024 15:00:00 UTC'
  },
  {
    id: 'STU-ACR23',
    recipientName: 'Hồ sơ Sinh viên',
    courseProgram: 'Chứng chỉ Mật mã học Nâng cao',
    issueDate: '10 tháng 12, 2023',
    status: 'Valid',
    txHash: '0x9c3ab2e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1c3',
    checksum: 'f4b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b866',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '10 thg 12, 2023 11:22:15 UTC'
  },
  {
    id: 'STU-BAR23',
    recipientName: 'Hồ sơ Sinh viên',
    courseProgram: 'Chứng chỉ Kiến trúc Blockchain',
    issueDate: '22 tháng 8, 2023',
    status: 'Valid',
    txHash: '0xad3cb2e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1d4',
    checksum: '05c0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b877',
    issuerName: 'Trường Đại học Stitch',
    issuerLogo: STITCH_UNIVERSITY_LOGO,
    timestamp: '22 thg 8, 2023 16:11:45 UTC'
  }
];

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
