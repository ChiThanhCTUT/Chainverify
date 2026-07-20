import { BrowserProvider, Contract } from 'ethers';
import CertificateABI from '../contracts/CertificateABI.json';
import { CONTRACT_ADDRESS } from '../contracts/config';

/**
 * [THANH & CÔNG - BLOCKCHAIN SERVICE TODO - Module 14, STT 27, 28]
 * - THANH cấu hình sẵn provider và định dạng lời gọi hàm theo ABI chuẩn.
 * - CÔNG kiểm tra khớp tham số với Smart Contract Solidity của CÔNG (Module 11).
 */

export const getContractInstance = async (withSigner = false) => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('Không tìm thấy MetaMask. Vui lòng cài đặt tiện ích MetaMask!');
  }

  const provider = new BrowserProvider((window as any).ethereum);
  if (withSigner) {
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, CertificateABI, signer);
  }
  return new Contract(CONTRACT_ADDRESS, CertificateABI, provider);
};

/**
 * [THANH & CÔNG]: Gọi Smart Contract để cấp chứng chỉ mới lên Blockchain
 */
export const issueCertificateOnChain = async (
  certId: string,
  recipientName: string,
  courseProgram: string,
  checksum: string
): Promise<string> => {
  try {
    /* [CÔNG: Mở comment khi Smart Contract đã deploy và địa chỉ trong config.ts là thật]:
    const contract = await getContractInstance(true);
    const tx = await contract.issueCertificate(certId, recipientName, courseProgram, checksum);
    await tx.wait(); // Chờ giao dịch xác nhận
    return tx.hash;
    */

    // Mock giả lập transaction hash cho UI test (chưa tốn gas thật):
    console.log(`[Mock Blockchain] Issuing cert: ${certId} - ${recipientName}`);
    return `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
  } catch (error: any) {
    console.error('Lỗi khi cấp chứng chỉ on-chain:', error);
    throw error;
  }
};

/**
 * [THANH & CÔNG]: Gọi hàm read-only trên Smart Contract để kiểm tra trạng thái chứng chỉ
 */
export const verifyCertificateOnChain = async (certId: string) => {
  try {
    /* [CÔNG: Mở comment khi Smart Contract sẵn sàng]:
    const contract = await getContractInstance(false);
    const result = await contract.verifyCertificate(certId);
    return {
      recipientName: result.recipientName,
      courseProgram: result.courseProgram,
      issueDate: result.issueDate,
      checksum: result.checksum,
      isValid: result.isValid,
      issuer: result.issuer,
    };
    */
    return null;
  } catch (error: any) {
    console.error('Lỗi khi tra cứu on-chain:', error);
    return null;
  }
};
