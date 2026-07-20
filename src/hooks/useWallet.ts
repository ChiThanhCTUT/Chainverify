import { useState, useCallback, useEffect } from 'react';
// import { BrowserProvider } from 'ethers';

/**
 * [CÔNG - METAMASK HOOK TODO - Module 13, STT 24, 25]
 * - Hook xử lý đăng nhập bằng ví MetaMask và theo dõi thay đổi tài khoản.
 * - CÔNG kiểm tra và bổ sung logic xử lý mạng/giao dịch khi cần.
 */

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        /* [CÔNG: Khi kết nối MetaMask thực tế, bật comment]:
        const provider = new BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setError(null);
        }
        return;
        */

        // Giả lập cho THANH & BIN test giao diện UI:
        const randomAddress = `0x${Array.from({ length: 4 }, () =>
          Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
        ).join('')}...${Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')}`;

        setAccount(randomAddress);
        setIsConnected(true);
        setError(null);
      } catch (err: any) {
        setError('Người dùng từ chối kết nối ví MetaMask.');
      }
    } else {
      setError('Không tìm thấy MetaMask. Vui lòng cài đặt tiện ích MetaMask trên trình duyệt!');
      // Fallback mô phỏng cho UI
      if (!isConnected) {
        setAccount('0x71C...8932 (MetaMask Giả lập)');
        setIsConnected(true);
      } else {
        setAccount(null);
        setIsConnected(false);
      }
    }
  }, [isConnected]);

  // Lắng nghe sự kiện thay đổi tài khoản từ MetaMask
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        if ((window as any).ethereum?.removeListener) {
          (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  return { account, isConnected, connectWallet, error };
}
