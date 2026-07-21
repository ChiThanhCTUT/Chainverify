import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider, getAddress } from 'ethers';

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_CHAIN_ID_HEX = '0x' + SEPOLIA_CHAIN_ID.toString(16);

function getEthereumProvider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return (window as any).ethereum;
  }
  return null;
}

/**
 * Hook xử lý đăng nhập bằng ví MetaMask và theo dõi thay đổi tài khoản/mạng.
 */
export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateConnectionState = useCallback(async () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      setError('Không tìm thấy MetaMask. Vui lòng cài đặt MetaMask trên trình duyệt.');
      setIsConnected(false);
      setAccount(null);
      return;
    }

    try {
      const provider = new BrowserProvider(ethereum, 'any');
      const accounts: string[] = await provider.send('eth_accounts', []);
      const network = await provider.getNetwork();

      if (network.chainId !== BigInt(SEPOLIA_CHAIN_ID)) {
        setError('Vui lòng chuyển MetaMask sang mạng Sepolia.');
        setIsConnected(false);
        return;
      }

      if (accounts.length > 0) {
        setAccount(getAddress(accounts[0]));
        setIsConnected(true);
        setError(null);
      } else {
        setAccount(null);
        setIsConnected(false);
      }
    } catch (err: any) {
      setError('Không thể đọc trạng thái MetaMask.');
      setIsConnected(false);
      setAccount(null);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      setError('Không tìm thấy MetaMask. Vui lòng cài đặt MetaMask trên trình duyệt.');
      return;
    }

    try {
      const provider = new BrowserProvider(ethereum, 'any');

      // Nếu không ở Sepolia, cố gắng yêu cầu MetaMask chuyển mạng
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(SEPOLIA_CHAIN_ID)) {
        try {
          await (ethereum as any).request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
          });
          // nhỏ delay để MetaMask cập nhật trạng thái
          await new Promise((r) => setTimeout(r, 300));
        } catch (switchErr: any) {
          if (switchErr?.code === 4902) {
            setError('Mạng Sepolia chưa được thêm vào MetaMask. Vui lòng thêm Sepolia thủ công.');
          } else if (switchErr?.code === 4001) {
            setError('Bạn đã từ chối yêu cầu chuyển mạng sang Sepolia.');
          } else {
            setError('Vui lòng chuyển MetaMask sang mạng Sepolia.');
          }
          setIsConnected(false);
          setAccount(null);
          return;
        }
      }

      // Yêu cầu cấp quyền truy cập tài khoản
      const accounts: string[] = await provider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        setAccount(getAddress(accounts[0]));
        setIsConnected(true);
        setError(null);
      }
    } catch (err: any) {
      if (err?.code === 4001) {
        setError('Người dùng từ chối kết nối với MetaMask.');
      } else {
        setError('Không thể kết nối với MetaMask.');
      }
      setIsConnected(false);
      setAccount(null);
    }
  }, []);

  useEffect(() => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      return;
    }

    updateConnectionState();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(getAddress(accounts[0]));
        setIsConnected(true);
        setError(null);
      } else {
        setAccount(null);
        setIsConnected(false);
      }
    };

    const handleChainChanged = (chainId: string) => {
      if (chainId !== SEPOLIA_CHAIN_ID_HEX) {
        setError('Vui lòng chuyển MetaMask sang mạng Sepolia.');
        setIsConnected(false);
        setAccount(null);
      } else {
        setError(null);
        updateConnectionState();
      }
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [updateConnectionState]);

  return { account, isConnected, connectWallet, error };
}
