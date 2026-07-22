import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '../hooks/useWallet';

export type UserRole = 'guest' | 'student' | 'admin';

interface AuthContextType {
  account: string | null;
  isConnected: boolean;
  userRole: UserRole;
  error: string | null;
  connectWallet: () => Promise<void>;
  loginAs: (role: 'student' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { account, isConnected, connectWallet: walletConnect, error: walletError } = useWallet();
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [error, setError] = useState<string | null>(null);

  // Sync error
  useEffect(() => {
    if (walletError) {
      setError(walletError);
    } else {
      setError(null);
    }
  }, [walletError]);

  // Load session role from localStorage when account connects
  useEffect(() => {
    if (isConnected && account) {
      const savedRole = localStorage.getItem(`chainverify_role_${account.toLowerCase()}`);
      if (savedRole === 'admin' || savedRole === 'student') {
        setUserRole(savedRole);
      } else {
        // Default to student if connected but no specific role set yet
        const defaultRole: UserRole = 'student';
        setUserRole(defaultRole);
        localStorage.setItem(`chainverify_role_${account.toLowerCase()}`, defaultRole);
      }
    } else {
      setUserRole('guest');
    }
  }, [isConnected, account]);

  const connectWallet = async () => {
    await walletConnect();
  };

  const loginAs = (role: 'student' | 'admin') => {
    if (!isConnected || !account) {
      setError('Vui lòng kết nối ví MetaMask trước khi đăng nhập.');
      return;
    }
    setUserRole(role);
    localStorage.setItem(`chainverify_role_${account.toLowerCase()}`, role);
    setError(null);
  };

  const logout = () => {
    setUserRole('guest');
    if (account) {
      localStorage.removeItem(`chainverify_role_${account.toLowerCase()}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        isConnected,
        userRole,
        error,
        connectWallet,
        loginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
