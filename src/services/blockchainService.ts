import { BrowserProvider, Contract } from 'ethers';
import CertificateABI from '../contracts/CertificateABI.json';
import { CONTRACT_ADDRESS } from '../contracts/config';

const isPlaceholderAddress = (address: string) => !address || address === '0x1234567890abcdef1234567890abcdef12345678';

export const getContractInstance = async (withSigner = false) => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('Không tìm thấy MetaMask. Vui lòng cài đặt tiện ích MetaMask!');
  }

  if (isPlaceholderAddress(CONTRACT_ADDRESS)) {
    throw new Error('Chưa cấu hình địa chỉ Smart Contract. Hãy cập nhật CONTRACT_ADDRESS trong src/contracts/config.ts.');
  }

  const provider = new BrowserProvider((window as any).ethereum);
  if (withSigner) {
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, CertificateABI, signer);
  }
  return new Contract(CONTRACT_ADDRESS, CertificateABI, provider);
};

export const issueCertificateOnChain = async (
  certId: string,
  recipientName: string,
  courseProgram: string,
  checksum: string
): Promise<string> => {
  try {
    const contract = await getContractInstance(true);
    const tx = await contract.issueCertificate(certId, recipientName, courseProgram, checksum);
    await tx.wait();
    return tx.hash;
  } catch (error: any) {
    console.error('Lỗi khi cấp chứng chỉ on-chain:', error);
    throw new Error(error?.message || 'Không thể ghi chứng chỉ lên blockchain.');
  }
};

export const verifyCertificateOnChain = async (certId: string) => {
  try {
    const contract = await getContractInstance(false);
    const result = await contract.verifyCertificate(certId);
    const [recipientName, courseProgram, issueDate, checksum, isValid, issuer] = result;

    return {
      recipientName,
      courseProgram,
      issueDate,
      checksum,
      isValid,
      issuer,
    };
  } catch (error: any) {
    console.error('Lỗi khi tra cứu on-chain:', error);
    return null;
  }
};

export const getCertificateStatus = async (certId: string) => {
  try {
    const onChain = await verifyCertificateOnChain(certId);
    if (!onChain) {
      return {
        exists: false,
        isValid: false,
        status: 'NotFound',
      };
    }

    return {
      exists: true,
      isValid: onChain.isValid,
      status: onChain.isValid ? 'Valid' : 'Revoked',
      data: onChain,
    };
  } catch (error: any) {
    console.error('Lỗi khi lấy trạng thái chứng chỉ:', error);
    return {
      exists: false,
      isValid: false,
      status: 'Error',
    };
  }
};
