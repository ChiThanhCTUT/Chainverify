import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      setError('Không tìm thấy MetaMask. Vui lòng cài đặt tiện ích MetaMask trên trình duyệt!');
      setAccount(null);
      setIsConnected(false);
      return;
    }

    try {
      const provider = new BrowserProvider(ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setError(null);
      } else {
        throw new Error('MetaMask chưa cấp quyền tài khoản.');
      }
    } catch (err: any) {
      const message = err?.message || 'Người dùng từ chối kết nối ví MetaMask.';
      setError(message);
      setAccount(null);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        setAccount(null);
        setIsConnected(false);
      }
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      if (ethereum?.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return { account, isConnected, connectWallet, error };
}
