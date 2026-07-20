/**
 * Smart contract configuration for ChainVerify.
 * Update the values below after deploying the contract.
 */

const env = import.meta.env as Record<string, string | undefined>;

export const CONTRACT_ADDRESS = env.VITE_CONTRACT_ADDRESS || '0x1234567890abcdef1234567890abcdef12345678';
export const SUPPORTED_CHAIN_ID = Number(env.VITE_CHAIN_ID || '11155111');
export const RPC_URL = env.VITE_RPC_URL || 'https://rpc.sepolia.org';

export const NETWORK_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
  31337: 'Hardhat Localhost',
};
