import { BrowserProvider, Contract } from 'ethers';
import CertificateABI from '../contracts/CertificateABI.json';
import { CONTRACT_ADDRESS, SUPPORTED_CHAIN_ID, NETWORK_NAMES } from '../contracts/config';
import { INITIAL_CERTIFICATES } from '../data';
import { Certificate } from '../types';

/**
 * [THANH - MODULE 14 COMPLETED]: Lớp dịch vụ tích hợp Ethers.js & Smart Contract (STT 26, 27)
 * - Tự động nhận diện chế độ:
 *   1. Chế độ Blockchain Thật (Real Web3): Khi CÔNG đã điền CONTRACT_ADDRESS hợp lệ và MetaMask sẵn sàng.
 *   2. Chế độ Giả lập an toàn (Hybrid Fallback Mode): Khi CÔNG đang phát triển Module 11, 12, giúp UI chạy mượt 100%.
 */

// Kiểm tra xem địa chỉ hợp đồng đã được CÔNG thay thế chưa
const isContractAddressConfigured = () => {
  const addr = String(CONTRACT_ADDRESS || '');
  return (
    addr !== '0x1234567890abcdef1234567890abcdef12345678' &&
    addr.startsWith('0x') &&
    addr.length === 42
  );
};

// Kiểm tra mạng lưới và yêu cầu chuyển sang Sepolia/Localhost nếu sai mạng
export const checkNetworkAndSwitch = async (provider: BrowserProvider): Promise<boolean> => {
  try {
    const network = await provider.getNetwork();
    const currentChainId = Number(network.chainId);

    if (currentChainId !== SUPPORTED_CHAIN_ID) {
      console.warn(
        `[Module 14] Sai mạng lưới. Hiện tại: ${currentChainId}, Yêu cầu: ${SUPPORTED_CHAIN_ID} (${NETWORK_NAMES[SUPPORTED_CHAIN_ID]})`
      );
      // Yêu cầu chuyển mạng trên MetaMask
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${SUPPORTED_CHAIN_ID.toString(16)}` }],
        });
        return true;
      } catch (switchError: any) {
        console.error('Người dùng từ chối chuyển mạng hoặc mạng chưa được thêm:', switchError);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Lỗi kiểm tra mạng lưới:', err);
    return false;
  }
};

/**
 * [STT 26]: Khởi tạo Ethers.js Contract Instance kết nối tới Smart Contract
 */
export const getContractInstance = async (withSigner = false): Promise<Contract | null> => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    console.warn('[Module 14] Không tìm thấy MetaMask trên trình duyệt.');
    return null;
  }

  if (!isContractAddressConfigured()) {
    console.info('[Module 14] Chế độ Fallback: CONTRACT_ADDRESS chưa được CÔNG điền trong config.ts.');
    return null;
  }

  try {
    const provider = new BrowserProvider((window as any).ethereum);
    const networkOk = await checkNetworkAndSwitch(provider);
    if (!networkOk) return null;

    if (withSigner) {
      const signer = await provider.getSigner();
      return new Contract(CONTRACT_ADDRESS, CertificateABI, signer);
    }
    return new Contract(CONTRACT_ADDRESS, CertificateABI, provider);
  } catch (err) {
    console.error('[Module 14] Lỗi khởi tạo Contract instance:', err);
    return null;
  }
};

/**
 * [STT 27 - Hàm 1]: Gọi Smart Contract để cấp chứng chỉ mới lên Blockchain
 */
export const issueCertificateOnChain = async (
  certId: string,
  recipientName: string,
  courseProgram: string,
  checksum: string
): Promise<string> => {
  const contract = await getContractInstance(true);

  // 1. Chế độ Real Web3 (Khi CÔNG đã deploy Smart Contract)
  if (contract) {
    try {
      console.log(`[Module 14 - Web3] Gửi giao dịch issueCertificate lên Blockchain...`);
      const tx = await contract.issueCertificate(certId, recipientName, courseProgram, checksum);
      console.log(`[Module 14 - Web3] Đã gửi TX: ${tx.hash}. Đang chờ xác nhận...`);
      await tx.wait();
      console.log(`[Module 14 - Web3] Giao dịch đã được ghi nhận thành công!`);
      return tx.hash;
    } catch (error: any) {
      console.error('[Module 14 - Web3] Lỗi gọi hàm issueCertificate trên Smart Contract:', error);
      throw new Error(error?.reason || error?.message || 'Lỗi khi ký giao dịch trên Blockchain.');
    }
  }

  // 2. Chế độ Fallback / Mocking (Khi CÔNG đang làm Module 11, 12)
  console.info(`[Module 14 - Fallback] Giả lập ghi nhận văn bằng ${certId} lên mạng lưới Blockchain...`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Mô phỏng độ trễ đào block
  const mockTxHash = `0x${Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
  return mockTxHash;
};

/**
 * [STT 27 - Hàm 2]: Tra cứu và xác minh văn bằng on-chain (dựa theo ID hoặc Checksum SHA-256)
 */
export interface OnChainCertificateData {
  certId: string;
  recipientName: string;
  courseProgram: string;
  issueDate: string;
  checksum: string;
  isValid: boolean;
  issuer: string;
  txHash?: string;
}

export const verifyCertificateOnChain = async (idOrChecksum: string): Promise<OnChainCertificateData | null> => {
  const query = idOrChecksum.trim().toLowerCase();
  const contract = await getContractInstance(false);

  // 1. Chế độ Real Web3 (Truy vấn sổ cái public từ Smart Contract)
  if (contract) {
    try {
      console.log(`[Module 14 - Web3] Đang gọi hàm verifyCertificate("${idOrChecksum}")...`);
      const result = await contract.verifyCertificate(idOrChecksum);
      if (result && result.recipientName) {
        return {
          certId: idOrChecksum.toUpperCase(),
          recipientName: result.recipientName,
          courseProgram: result.courseProgram,
          issueDate: result.issueDate || new Date().toLocaleDateString('vi-VN'),
          checksum: result.checksum,
          isValid: Boolean(result.isValid),
          issuer: result.issuer,
        };
      }
    } catch (error: any) {
      console.warn(`[Module 14 - Web3] Không tìm thấy chứng chỉ "${idOrChecksum}" trên Blockchain thật.`);
      return null;
    }
  }

  // 2. Chế độ Fallback / Mocking (Khớp với dữ liệu bộ nhớ hoặc localStorage để test)
  console.info(`[Module 14 - Fallback] Kiểm tra văn bằng "${idOrChecksum}" trong cơ sở dữ liệu mẫu...`);
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Tra cứu trong localStorage (chứng chỉ do admin vừa tạo lúc test) hoặc mock ban đầu
  let allCerts: Certificate[] = INITIAL_CERTIFICATES;
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('chainverify_certs');
    if (cached) {
      try {
        allCerts = JSON.parse(cached);
      } catch (e) {
        // Fallback
      }
    }
  }

  const found = allCerts.find(
    (c) =>
      c.id.toLowerCase() === query ||
      c.checksum.toLowerCase() === query ||
      c.txHash.toLowerCase() === query
  );

  if (found) {
    return {
      certId: found.id,
      recipientName: found.recipientName,
      courseProgram: found.courseProgram,
      issueDate: found.issueDate,
      checksum: found.checksum,
      isValid: found.status === 'Valid',
      issuer: found.issuerName || 'Trường Đại học Stitch (Blockchain Sepolia)',
      txHash: found.txHash,
    };
  }

  return null;
};

/**
 * [STT 27 - Hàm 3]: Thu hồi văn bằng on-chain (Dành cho Quản trị viên)
 */
export const revokeCertificateOnChain = async (certId: string): Promise<boolean> => {
  const contract = await getContractInstance(true);

  // 1. Chế độ Real Web3
  if (contract) {
    try {
      console.log(`[Module 14 - Web3] Gửi yêu cầu thu hồi văn bằng ${certId}...`);
      const tx = await contract.revokeCertificate(certId);
      await tx.wait();
      console.log(`[Module 14 - Web3] Đã thu hồi thành công văn bằng ${certId} trên Blockchain.`);
      return true;
    } catch (error: any) {
      console.error('[Module 14 - Web3] Lỗi thu hồi văn bằng:', error);
      throw new Error(error?.reason || error?.message || 'Không thể thu hồi văn bằng trên Blockchain.');
    }
  }

  // 2. Chế độ Fallback / Mocking
  console.info(`[Module 14 - Fallback] Đã giả lập thu hồi thành công văn bằng ${certId}.`);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return true;
};
